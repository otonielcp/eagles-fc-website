"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { format } from "date-fns";
import {
  Briefcase,
  CalendarClock,
  Copy,
  ExternalLink,
  EyeOff,
  FilePen,
  MoreHorizontal,
  Pencil,
  Plus,
  Rocket,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteJob, duplicateJob, getJobsAdmin, setJobStatus } from "@/actions/hiring";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  formatDateOnly,
  isPastDeadline,
  type AdminJob,
  type JobStatus,
} from "@/lib/hiring";

type DisplayStatus = JobStatus | "expired";

const STATUS_STYLES: Record<DisplayStatus, { label: string; badge: string; dot: string }> = {
  open: { label: "Open", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  draft: { label: "Draft", badge: "bg-zinc-100 text-zinc-600 border-zinc-200", dot: "bg-zinc-400" },
  closed: { label: "Closed", badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-400" },
  expired: { label: "Deadline passed", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
};

function displayStatus(job: AdminJob): DisplayStatus {
  return job.status === "open" && isPastDeadline(job.applicationDeadline) ? "expired" : job.status;
}

export default function JobPostingsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminJob | null>(null);

  const load = async () => {
    try {
      setJobs(await getJobsAdmin());
    } catch {
      toast.error("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (job: AdminJob, status: JobStatus) => {
    const result = await setJobStatus(job._id, status);
    if (result.success) {
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, status } : j)));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleDuplicate = async (job: AdminJob) => {
    const result = await duplicateJob(job._id);
    if (result.success) {
      toast.success(result.message);
      router.push(`/admin/hiring/jobs/${result.data.id}/edit`);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const result = await deleteJob(pendingDelete._id);
    if (result.success) {
      setJobs((prev) => prev.filter((j) => j._id !== pendingDelete._id));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setPendingDelete(null);
  };

  const stats = [
    { label: "Open", value: jobs.filter((j) => displayStatus(j) === "open").length, dot: "bg-emerald-400" },
    { label: "Drafts", value: jobs.filter((j) => j.status === "draft").length, dot: "bg-zinc-400" },
    { label: "Closed / expired", value: jobs.filter((j) => ["closed", "expired"].includes(displayStatus(j))).length, dot: "bg-rose-400" },
    { label: "Applicants", value: jobs.reduce((sum, j) => sum + j.applicantCount, 0), dot: "bg-[#C5A464]" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 md:p-8 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A464]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#C5A464] to-[#9A7B3E] shadow-lg shadow-[#C5A464]/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Job Postings</h1>
              <p className="text-zinc-400 text-sm mt-0.5">Coaching and staff positions shown on /careers</p>
            </div>
          </div>
          <Link href="/admin/hiring/jobs/new">
            <Button className="bg-gradient-to-r from-[#C5A464] to-[#B39355] hover:from-[#B39355] hover:to-[#9A7B3E] text-white rounded-xl gap-2 shadow-md shadow-[#C5A464]/20">
              <Plus className="w-4 h-4" /> New posting
            </Button>
          </Link>
        </div>
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{stat.label}</span>
                <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
              </div>
              <p className="text-3xl font-bold tracking-tight text-zinc-200">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-full border-[3px] border-gray-100 border-t-[#C5A464] animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-5 border border-gray-200">
            <Briefcase className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No job postings yet</h3>
          <p className="text-sm text-gray-400 mt-1.5 max-w-sm">
            Create your first posting. Templates for head coach, assistant coach, goalkeeper coach and club
            administrator are ready to go.
          </p>
          <Link href="/admin/hiring/jobs/new" className="mt-6">
            <Button className="bg-[#C5A464] hover:bg-[#B39355] rounded-xl gap-2">
              <Plus className="w-4 h-4" /> New posting
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const status = displayStatus(job);
            const style = STATUS_STYLES[status];
            return (
              <div key={job._id} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C5A464]/10 to-[#C5A464]/5 flex items-center justify-center border border-[#C5A464]/10">
                        <Briefcase className="w-5 h-5 text-[#C5A464]" />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${style.dot}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link href={`/admin/hiring/jobs/${job._id}/edit`} className="font-semibold text-gray-900 hover:text-[#8A6D35] text-[15px] truncate">
                          {job.title}
                        </Link>
                        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${style.badge}`}>{style.label}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                        <span>{DEPARTMENTS[job.department]}</span>
                        <span className="text-gray-300">·</span>
                        <span>{EMPLOYMENT_TYPES[job.employmentType]}</span>
                        {job.team && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span>{job.team}</span>
                          </>
                        )}
                        {job.applicationDeadline && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="w-3.5 h-3.5" /> {formatDateOnly(job.applicationDeadline)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link
                      href={`/admin/hiring/applications?job=${job._id}`}
                      className="inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-xl border border-gray-200 hover:border-[#C5A464] hover:text-[#8A6D35] transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      {job.applicantCount} {job.applicantCount === 1 ? "applicant" : "applicants"}
                      {job.newApplicantCount > 0 && (
                        <span className="text-[10px] font-semibold bg-emerald-500 text-white rounded-full px-1.5 py-0.5">
                          {job.newApplicantCount} new
                        </span>
                      )}
                    </Link>
                    <span className="hidden xl:block text-xs text-gray-400 w-28 text-right">
                      Updated {format(new Date(job.updatedAt), "MMM d")}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-xl h-9 w-9" aria-label={`Actions for ${job.title}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={() => router.push(`/admin/hiring/jobs/${job._id}/edit`)}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        {status === "open" && (
                          <DropdownMenuItem onClick={() => window.open(`/careers/${job.slug}`, "_blank")}>
                            <ExternalLink className="w-4 h-4 mr-2" /> View on site
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(job)}>
                          <Copy className="w-4 h-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.status !== "open" && (
                          <DropdownMenuItem onClick={() => handleStatus(job, "open")}>
                            <Rocket className="w-4 h-4 mr-2" /> Publish
                          </DropdownMenuItem>
                        )}
                        {job.status === "open" && (
                          <DropdownMenuItem onClick={() => handleStatus(job, "closed")}>
                            <EyeOff className="w-4 h-4 mr-2" /> Close posting
                          </DropdownMenuItem>
                        )}
                        {job.status !== "draft" && (
                          <DropdownMenuItem onClick={() => handleStatus(job, "draft")}>
                            <FilePen className="w-4 h-4 mr-2" /> Move to drafts
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setPendingDelete(job)} className="text-red-600 focus:text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {status === "expired" && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-4">
                    The deadline has passed, so this posting is hidden from the careers page. Edit the deadline to reopen it, or close it.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this posting?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{pendingDelete?.title}</strong> will be permanently removed.
              {pendingDelete && pendingDelete.applicantCount > 0 && (
                <> Its {pendingDelete.applicantCount} application(s) are kept and stay under Applications.</>
              )}{" "}
              If you only want to stop accepting applications, close the posting instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
              Delete posting
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster position="top-center" richColors />
    </div>
  );
}
