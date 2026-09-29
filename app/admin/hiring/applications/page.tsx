"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronDown, ClipboardList, FileText, MapPin, Search, ShieldCheck, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApplicationsAdmin, getJobsAdmin } from "@/actions/hiring";
import StageBadge, { STAGE_STYLES } from "@/components/admin/hiring/StageBadge";
import {
  DEPARTMENTS,
  STAGES,
  STAGE_LABELS,
  complianceKeysFor,
  type ApplicationSummary,
  type Department,
  type Stage,
} from "@/lib/hiring";

const GENERAL = "general";

function initials(app: ApplicationSummary) {
  return `${app.firstName[0] ?? ""}${app.lastName[0] ?? ""}`.toUpperCase();
}

function ApplicationsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [jobOptions, setJobOptions] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<"all" | Stage>("all");
  const [jobFilter, setJobFilter] = useState(searchParams.get("job") ?? "all");
  const [department, setDepartment] = useState<"all" | Department>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([getApplicationsAdmin(), getJobsAdmin()])
      .then(([apps, jobs]) => {
        setApplications(apps);
        // Postings first, then any deleted postings that still have applicants.
        const options = jobs.map((job) => ({ id: job._id, title: job.title }));
        for (const app of apps) {
          if (app.jobId && !options.some((o) => o.id === app.jobId)) {
            options.push({ id: app.jobId, title: `${app.jobTitle} (deleted posting)` });
          }
        }
        setJobOptions(options);
      })
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  const changeJobFilter = (value: string) => {
    setJobFilter(value);
    router.replace(value === "all" ? "/admin/hiring/applications" : `/admin/hiring/applications?job=${value}`, { scroll: false });
  };

  // Everything except the stage filter, so the stage counts reflect the other filters.
  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((app) => {
      if (jobFilter === GENERAL ? app.jobId !== null : jobFilter !== "all" && app.jobId !== jobFilter) return false;
      if (department !== "all" && app.department !== department) return false;
      if (!q) return true;
      return [app.firstName, app.lastName, `${app.firstName} ${app.lastName}`, app.email, app.referenceCode, app.jobTitle]
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [applications, jobFilter, department, query]);

  const visible = stage === "all" ? scoped : scoped.filter((app) => app.stage === stage);
  const counts = Object.fromEntries(STAGES.map((s) => [s, scoped.filter((a) => a.stage === s).length])) as Record<Stage, number>;

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 md:p-8 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A464]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#C5A464] to-[#9A7B3E] shadow-lg shadow-[#C5A464]/20">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Applications</h1>
              <p className="text-zinc-400 text-sm mt-0.5">Review coaching and staff applicants through hiring</p>
            </div>
          </div>
          <Link href="/admin/hiring/jobs">
            <Button variant="outline" className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
              Manage job postings
            </Button>
          </Link>
        </div>

        {/* Pipeline */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 mt-8">
          {(["all", ...STAGES] as const).map((key) => {
            const active = stage === key;
            return (
              <button
                key={key}
                onClick={() => setStage(key)}
                className={`relative rounded-xl p-4 text-left transition-all duration-300 border ${
                  active
                    ? "bg-[#C5A464]/15 border-[#C5A464]/40 shadow-lg shadow-[#C5A464]/10"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className={`text-[11px] font-medium uppercase tracking-wider truncate ${active ? "text-[#C5A464]" : "text-zinc-500"}`}>
                    {key === "all" ? "All" : STAGE_LABELS[key]}
                  </span>
                  {key !== "all" && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STAGE_STYLES[key].dot}`} />}
                </div>
                <p className={`text-3xl font-bold tracking-tight ${active ? "text-white" : "text-zinc-300"}`}>
                  {key === "all" ? scoped.length : counts[key]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, reference or position…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A464]/30 focus:border-[#C5A464] transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="relative">
          <select
            value={jobFilter}
            onChange={(e) => changeJobFilter(e.target.value)}
            aria-label="Filter by position"
            className="appearance-none w-full lg:w-64 text-sm border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A464]/20 focus:border-[#C5A464] cursor-pointer"
          >
            <option value="all">All positions</option>
            <option value={GENERAL}>General applications</option>
            {jobOptions.map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as "all" | Department)}
            aria-label="Filter by department"
            className="appearance-none w-full lg:w-48 text-sm border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A464]/20 focus:border-[#C5A464] cursor-pointer"
          >
            <option value="all">All departments</option>
            {Object.entries(DEPARTMENTS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-full border-[3px] border-gray-100 border-t-[#C5A464] animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-5 border border-gray-200">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No applications found</h3>
          <p className="text-sm text-gray-400 mt-1.5 max-w-sm">
            {applications.length === 0
              ? "Applications appear here when people apply through the careers page."
              : "Nothing matches these filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {visible.map((app) => {
            const checks = complianceKeysFor(app.department);
            const done = checks.filter((key) => app.compliance[key]).length;
            return (
              <Link
                key={app._id}
                href={`/admin/hiring/applications/${app._id}`}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C5A464]/15 to-[#C5A464]/5 border border-[#C5A464]/10 flex items-center justify-center text-sm font-bold text-[#8A6D35]">
                      {initials(app)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${STAGE_STYLES[app.stage].dot}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-semibold text-gray-900 text-[15px]">
                        {app.firstName} {app.lastName}
                      </span>
                      <StageBadge stage={app.stage} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-sm text-gray-500">
                      <span className="truncate">{app.jobTitle}</span>
                      {(app.city || app.state) && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {[app.city, app.state].filter(Boolean).join(", ")}
                          </span>
                        </>
                      )}
                      <span className="text-gray-300">·</span>
                      <span>{app.yearsExperience} yrs exp</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 flex-shrink-0 text-sm pl-[60px] md:pl-0">
                  <div className="flex items-center gap-0.5" aria-label={`Rated ${app.rating} of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= app.rating ? "fill-[#C5A464] text-[#C5A464]" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${done === checks.length ? "text-emerald-600" : "text-gray-400"}`}
                    title="Compliance checks completed"
                  >
                    <ShieldCheck className="w-4 h-4" /> {done}/{checks.length}
                  </span>
                  <FileText className={`w-4 h-4 ${app.hasResume ? "text-[#C5A464]" : "text-gray-200"}`} aria-label={app.hasResume ? "Resume attached" : "No resume"} />
                  <div className="hidden sm:flex flex-col items-end w-28">
                    <span className="text-xs text-gray-500">{format(new Date(app.createdAt), "MMM d, yyyy")}</span>
                    <span className="text-[10px] text-gray-300">{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function ApplicationsPage() {
  // useSearchParams needs a Suspense boundary or the build fails to prerender this page.
  return (
    <Suspense fallback={null}>
      <ApplicationsList />
    </Suspense>
  );
}
