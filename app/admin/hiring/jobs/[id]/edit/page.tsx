"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Toaster } from "sonner";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobForm from "@/components/admin/hiring/JobForm";
import { getJobAdmin } from "@/actions/hiring";
import { isPastDeadline, type AdminJob } from "@/lib/hiring";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<AdminJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobAdmin(id)
      .then(setJob)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-[3px] border-gray-100 border-t-[#C5A464] animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-gray-700">Job posting not found</h3>
        <Link href="/admin/hiring/jobs" className="mt-4 inline-block">
          <Button className="bg-[#C5A464] hover:bg-[#B39355] rounded-xl">Back to job postings</Button>
        </Link>
      </div>
    );
  }

  const isLive = job.status === "open" && !isPastDeadline(job.applicationDeadline);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <Link href="/admin/hiring/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3">
            <ArrowLeft className="w-4 h-4" /> Job postings
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit posting</h1>
          <p className="text-sm text-gray-500 mt-1">
            {job.applicantCount} {job.applicantCount === 1 ? "applicant" : "applicants"} so far
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/hiring/applications?job=${job._id}`}>
            <Button variant="outline" className="rounded-xl">View applicants</Button>
          </Link>
          {isLive && (
            <a href={`/careers/${job.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-xl gap-2">
                <ExternalLink className="w-4 h-4" /> View on site
              </Button>
            </a>
          )}
        </div>
      </div>
      <JobForm job={job} />
      <Toaster position="top-center" richColors />
    </div>
  );
}
