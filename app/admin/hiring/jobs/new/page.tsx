"use client";

import Link from "next/link";
import { Toaster } from "sonner";
import { ArrowLeft } from "lucide-react";
import JobForm from "@/components/admin/hiring/JobForm";

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/hiring/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3">
          <ArrowLeft className="w-4 h-4" /> Job postings
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">New job posting</h1>
        <p className="text-sm text-gray-500 mt-1">Saved as a draft until you set the status to Open.</p>
      </div>
      <JobForm />
      <Toaster position="top-center" richColors />
    </div>
  );
}
