"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveJob } from "@/actions/hiring";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  type AdminJob,
  type Department,
  type EmploymentType,
  type JobInput,
  type JobStatus,
} from "@/lib/hiring";
import { JOB_TEMPLATES } from "./jobTemplates";

const inputClass =
  "w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A464]/20 focus:border-[#C5A464] transition-all placeholder:text-gray-300";
const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

type ListKey = "responsibilities" | "requirements" | "preferred" | "benefits";
const LIST_FIELDS: { key: ListKey; label: string; placeholder: string }[] = [
  { key: "responsibilities", label: "Responsibilities", placeholder: "Plan and run weekly training sessions" },
  { key: "requirements", label: "Requirements", placeholder: "Current SafeSport training" },
  { key: "preferred", label: "Nice to have", placeholder: "US Soccer D license" },
  { key: "benefits", label: "What we offer", placeholder: "Club apparel and coaching education support" },
];

type FormState = Omit<JobInput, ListKey> & Record<ListKey, string>;

function toFormState(job?: Partial<JobInput> | null): FormState {
  return {
    title: job?.title ?? "",
    department: job?.department ?? "coaching",
    employmentType: job?.employmentType ?? "part_time",
    location: job?.location ?? "Grand Island, NE",
    team: job?.team ?? "",
    compensation: job?.compensation ?? "",
    startDate: job?.startDate ?? "",
    applicationDeadline: job?.applicationDeadline ?? "",
    summary: job?.summary ?? "",
    description: job?.description ?? "",
    status: job?.status ?? "draft",
    responsibilities: (job?.responsibilities ?? []).join("\n"),
    requirements: (job?.requirements ?? []).join("\n"),
    preferred: (job?.preferred ?? []).join("\n"),
    benefits: (job?.benefits ?? []).join("\n"),
  };
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function JobForm({ job }: { job?: AdminJob | null }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(job));
  const [saving, setSaving] = useState(false);
  const isNew = !job;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const applyTemplate = (index: number) => {
    const template = JOB_TEMPLATES[index];
    const hasContent = form.title || form.summary || form.description || form.responsibilities;
    if (hasContent && !window.confirm(`Replace what you have entered with the "${template.name}" template?`)) return;
    setForm((prev) => ({ ...toFormState(template.job), location: prev.location, status: prev.status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toList = (value: string) =>
      value
        .split("\n")
        .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
        .filter(Boolean);
    const input: JobInput = {
      ...form,
      responsibilities: toList(form.responsibilities),
      requirements: toList(form.requirements),
      preferred: toList(form.preferred),
      benefits: toList(form.benefits),
    };
    const result = await saveJob(job?._id ?? null, input);
    setSaving(false);
    if (result.success) {
      toast.success(result.message);
      router.push("/admin/hiring/jobs");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isNew && (
        <div className="rounded-2xl border border-[#C5A464]/20 bg-gradient-to-br from-[#C5A464]/[0.06] to-transparent p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-4 h-4 text-[#C5A464]" />
            <span className="text-sm font-semibold text-gray-800">Start from a template</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {JOB_TEMPLATES.map((template, index) => (
              <button
                key={template.name}
                type="button"
                onClick={() => applyTemplate(index)}
                className="text-sm px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-[#C5A464] hover:text-[#8A6D35] transition-colors"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title="Basics">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>Job title *</label>
                <input id="title" className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. U11 Boys Head Coach" maxLength={120} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="department" className={labelClass}>Department *</label>
                  <select id="department" className={inputClass} value={form.department} onChange={(e) => set("department", e.target.value as Department)}>
                    {Object.entries(DEPARTMENTS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="employmentType" className={labelClass}>Employment type *</label>
                  <select id="employmentType" className={inputClass} value={form.employmentType} onChange={(e) => set("employmentType", e.target.value as EmploymentType)}>
                    {Object.entries(EMPLOYMENT_TYPES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Description" subtitle="The summary appears on the job board card; the full description on the job page.">
            <div className="space-y-4">
              <div>
                <label htmlFor="summary" className={labelClass}>Summary</label>
                <textarea id="summary" rows={3} className={`${inputClass} resize-y`} value={form.summary} onChange={(e) => set("summary", e.target.value)} maxLength={400} placeholder="One or two sentences about the role" />
                <p className="text-[11px] text-gray-400 mt-1 text-right">{form.summary.length}/400</p>
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>About the role</label>
                <textarea id="description" rows={6} className={`${inputClass} resize-y`} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={8000} />
              </div>
            </div>
          </Card>

          <Card title="Details lists" subtitle="One item per line. Empty lists are hidden on the job page.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LIST_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label htmlFor={key} className={labelClass}>{label}</label>
                  <textarea id={key} rows={6} className={`${inputClass} resize-y font-mono text-[13px]`} value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publishing">
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className={labelClass}>Status</label>
                <select id="status" className={inputClass} value={form.status} onChange={(e) => set("status", e.target.value as JobStatus)}>
                  {Object.entries(JOB_STATUSES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {form.status === "open"
                    ? "Visible on /careers and accepting applications."
                    : form.status === "draft"
                    ? "Only visible here. Publish when it is ready."
                    : "Hidden from /careers. Existing applications are kept."}
                </p>
              </div>
              <div>
                <label htmlFor="applicationDeadline" className={labelClass}>Application deadline</label>
                <input id="applicationDeadline" type="date" className={inputClass} value={form.applicationDeadline} onChange={(e) => set("applicationDeadline", e.target.value)} />
                <p className="text-[11px] text-gray-400 mt-1.5">Optional. The posting hides itself after this date.</p>
              </div>
            </div>
          </Card>

          <Card title="Position details" subtitle="Leave blank to hide.">
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <input id="location" className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} maxLength={100} />
              </div>
              <div>
                <label htmlFor="team" className={labelClass}>Team / age group</label>
                <input id="team" className={inputClass} value={form.team} onChange={(e) => set("team", e.target.value)} placeholder="e.g. U13 Boys" maxLength={100} />
              </div>
              <div>
                <label htmlFor="compensation" className={labelClass}>Compensation</label>
                <input id="compensation" className={inputClass} value={form.compensation} onChange={(e) => set("compensation", e.target.value)} placeholder="e.g. $1,500 per season, or Volunteer" maxLength={120} />
              </div>
              <div>
                <label htmlFor="startDate" className={labelClass}>Start</label>
                <input id="startDate" className={inputClass} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} placeholder="e.g. Spring 2027 season" maxLength={60} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/admin/hiring/jobs">
          <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
        </Link>
        <Button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-[#C5A464] to-[#B39355] hover:from-[#B39355] hover:to-[#9A7B3E] text-white shadow-md shadow-[#C5A464]/20 rounded-xl px-6 gap-2"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? "Create posting" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
