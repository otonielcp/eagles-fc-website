"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  Check,
  Download,
  ExternalLink,
  FileText,
  Linkedin,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  StickyNote,
  Trash2,
  User,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  addApplicationNote,
  cancelInterview,
  deleteApplication,
  deleteApplicationNote,
  getApplicationAdmin,
  scheduleInterview,
  setApplicationRating,
  setComplianceItem,
  updateApplicationStage,
} from "@/actions/hiring";
import StageBadge, { STAGE_STYLES } from "@/components/admin/hiring/StageBadge";
import {
  COMPLIANCE_ITEMS,
  DEPARTMENTS,
  EXIT_STAGES,
  PIPELINE_STAGES,
  REQUIRED_BEFORE_HIRE,
  SAFESPORT_STATUSES,
  STAGE_LABELS,
  complianceKeysFor,
  formatWallClock,
  type ApplicationDetail,
  type ComplianceKey,
  type Stage,
} from "@/lib/hiring";

const inputClass =
  "w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A464]/20 focus:border-[#C5A464] transition-all placeholder:text-gray-300";
const goldButton =
  "bg-gradient-to-r from-[#C5A464] to-[#B39355] hover:from-[#B39355] hover:to-[#9A7B3E] text-white shadow-md shadow-[#C5A464]/20 rounded-xl";

function Panel({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#C5A464]" />
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</dt>
      <dd className="text-sm text-gray-800 mt-0.5">{value || <span className="text-gray-300">Not provided</span>}</dd>
    </div>
  );
}

function YesNoPill({ value, yes = "Yes", no = "No" }: { value: boolean; yes?: string; no?: string }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${
        value ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
      }`}
    >
      {value ? yes : no}
    </span>
  );
}

function Tags({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-gray-300 text-sm">None listed</span>;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item) => (
        <span key={item} className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [pendingStage, setPendingStage] = useState<Stage | null>(null);
  const [notifyDecline, setNotifyDecline] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [interviewForm, setInterviewForm] = useState({ scheduledAt: "", location: "", details: "" });
  const [notifyInterview, setNotifyInterview] = useState(true);
  const [editingInterview, setEditingInterview] = useState(false);

  const [note, setNote] = useState("");

  useEffect(() => {
    getApplicationAdmin(id)
      .then(setApp)
      .catch(() => toast.error("Failed to load application"))
      .finally(() => setLoading(false));
  }, [id]);

  /** Runs a mutation that returns the refreshed application. */
  const run = async (action: () => Promise<{ success: boolean; message: string; warning?: string; data?: ApplicationDetail }>) => {
    setBusy(true);
    try {
      const result = await action();
      if (!result.success) {
        toast.error(result.message);
        return false;
      }
      if (result.data) setApp(result.data);
      if (result.warning) toast.warning(result.warning);
      else toast.success(result.message);
      return true;
    } catch {
      toast.error("Something went wrong. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-[3px] border-gray-100 border-t-[#C5A464] animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-gray-700">Application not found</h3>
        <Link href="/admin/hiring/applications" className="mt-4 inline-block">
          <Button className="bg-[#C5A464] hover:bg-[#B39355] rounded-xl">Back to applications</Button>
        </Link>
      </div>
    );
  }

  const isCoaching = app.department === "coaching";
  const checks = complianceKeysFor(app.department);
  const checksDone = checks.filter((key) => app.compliance[key]).length;
  const missingForHire = REQUIRED_BEFORE_HIRE.filter((key) => !app.compliance[key]);
  const stageIndex = PIPELINE_STAGES.indexOf(app.stage as (typeof PIPELINE_STAGES)[number]);
  const isExited = (EXIT_STAGES as readonly Stage[]).includes(app.stage);

  const requestStage = (stage: Stage) => {
    if (stage === app.stage || busy) return;
    // Declines and hires get a confirmation; everything else moves straight away.
    if (stage === "rejected" || (stage === "hired" && missingForHire.length)) {
      setNotifyDecline(false);
      setPendingStage(stage);
      return;
    }
    run(() => updateApplicationStage(app._id, stage));
  };

  const confirmStage = async () => {
    if (!pendingStage) return;
    const stage = pendingStage;
    setPendingStage(null);
    await run(() => updateApplicationStage(app._id, stage, { notify: stage === "rejected" && notifyDecline }));
  };

  const handleRating = async (value: number) => {
    const rating = value === app.rating ? 0 : value;
    const previous = app.rating;
    setApp({ ...app, rating });
    const result = await setApplicationRating(app._id, rating);
    if (!result.success) {
      setApp((current) => (current ? { ...current, rating: previous } : current));
      toast.error(result.message);
    }
  };

  const startEditingInterview = () => {
    setInterviewForm(app.interview ?? { scheduledAt: "", location: "", details: "" });
    setNotifyInterview(true);
    setEditingInterview(true);
  };

  const saveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await run(() => scheduleInterview(app._id, interviewForm, { notify: notifyInterview }));
    if (ok) setEditingInterview(false);
  };

  const submitNote = async () => {
    const ok = await run(() => addApplicationNote(app._id, note));
    if (ok) setNote("");
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    const result = await deleteApplication(app._id);
    if (result.success) {
      toast.success(result.message);
      router.push("/admin/hiring/applications");
    } else {
      toast.error(result.message);
    }
  };

  const showInterviewForm = editingInterview || (!app.interview && !isExited && app.stage !== "hired");

  return (
    <div className="space-y-6">
      <Link href="/admin/hiring/applications" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Applications
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C5A464] to-[#9A7B3E] flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-[#C5A464]/20 flex-shrink-0">
              {`${app.firstName[0] ?? ""}${app.lastName[0] ?? ""}`.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {app.firstName} {app.lastName}
                </h1>
                <StageBadge stage={app.stage} />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {app.jobId ? (
                  <Link href={`/admin/hiring/jobs/${app.jobId}/edit`} className="font-medium text-gray-700 hover:text-[#8A6D35]">
                    {app.jobTitle}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-700">{app.jobTitle}</span>
                )}
                <span className="text-gray-300 mx-1.5">·</span>
                {DEPARTMENTS[app.department]}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {app.referenceCode} · Applied {format(new Date(app.createdAt), "MMM d, yyyy 'at' h:mm a")} (
                {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href={`mailto:${app.email}`}>
              <Button variant="outline" size="sm" className="rounded-xl gap-2 h-9"><Mail className="w-4 h-4" /> Email</Button>
            </a>
            <a href={`tel:${app.phone}`}>
              <Button variant="outline" size="sm" className="rounded-xl gap-2 h-9"><Phone className="w-4 h-4" /> Call</Button>
            </a>
            {app.resume && (
              <a href={`/admin/hiring/applications/${app._id}/resume`}>
                <Button size="sm" className={`${goldButton} gap-2 h-9`}><Download className="w-4 h-4" /> Resume</Button>
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="rounded-xl h-9 text-red-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
              aria-label="Delete application"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stage stepper */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col xl:flex-row xl:items-center gap-4">
          <ol className="flex flex-1 items-center overflow-x-auto">
            {PIPELINE_STAGES.map((stage, index) => {
              const reached = !isExited && stageIndex >= index;
              const current = app.stage === stage;
              return (
                <li key={stage} className="flex items-center flex-1 min-w-[96px] last:flex-none">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => requestStage(stage)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                      current
                        ? "bg-[#C5A464]/15 text-[#8A6D35] font-semibold ring-1 ring-[#C5A464]/30"
                        : reached
                        ? "text-gray-700 hover:bg-gray-50"
                        : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        reached ? "bg-[#C5A464] text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {reached && !current ? <Check className="w-3.5 h-3.5" /> : index + 1}
                    </span>
                    {STAGE_LABELS[stage]}
                  </button>
                  {index < PIPELINE_STAGES.length - 1 && (
                    <span className={`flex-1 h-0.5 mx-1 rounded-full ${!isExited && stageIndex > index ? "bg-[#C5A464]" : "bg-gray-100"}`} />
                  )}
                </li>
              );
            })}
          </ol>
          <div className="flex gap-2 flex-shrink-0">
            {EXIT_STAGES.map((stage) => {
              const style = STAGE_STYLES[stage];
              const Icon = style.icon;
              return (
                <button
                  key={stage}
                  type="button"
                  disabled={busy}
                  onClick={() => requestStage(stage)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all ${
                    app.stage === stage ? `${style.badge} font-semibold` : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {STAGE_LABELS[stage]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          <Panel icon={User} title="Contact & eligibility">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Fact
                label="Email"
                value={
                  <a href={`mailto:${app.email}`} className="text-[#8A6D35] hover:underline inline-flex items-center gap-1">
                    {app.email} <ArrowUpRight className="w-3 h-3" />
                  </a>
                }
              />
              <Fact
                label="Phone"
                value={
                  <a href={`tel:${app.phone}`} className="text-[#8A6D35] hover:underline inline-flex items-center gap-1">
                    {app.phone} <ArrowUpRight className="w-3 h-3" />
                  </a>
                }
              />
              <Fact label="Location" value={[app.city, app.state, app.zip].filter(Boolean).join(", ")} />
              <Fact label="SafeSport training" value={SAFESPORT_STATUSES[app.safeSportStatus]} />
              <Fact label="18 or older" value={<YesNoPill value={app.isAdult} />} />
              <Fact label="Authorized to work in U.S." value={<YesNoPill value={app.workAuthorized} />} />
              <Fact label="Agreed to background check" value={<YesNoPill value={app.backgroundCheckAck} />} />
              {isCoaching && <Fact label="CPR / First Aid" value={<YesNoPill value={app.cprCertified} yes="Certified" no="Not certified" />} />}
            </dl>
          </Panel>

          <Panel icon={Zap} title={isCoaching ? "Coaching background" : "Experience & skills"}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Fact label={isCoaching ? "Years coaching" : "Years of experience"} value={String(app.yearsExperience)} />
              {isCoaching ? (
                <Fact label="Highest level played" value={app.playingLevel} />
              ) : (
                <Fact label="Software & tools" value={app.software} />
              )}
              {isCoaching ? (
                <>
                  <div className="sm:col-span-2">
                    <Fact label="Licenses & certifications" value={<Tags items={app.licenses} />} />
                  </div>
                  <div className="sm:col-span-2">
                    <Fact label="Age groups coached" value={<Tags items={app.ageGroups} />} />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <Fact label="Experience areas" value={<Tags items={app.adminSkills} />} />
                </div>
              )}
              <div className="sm:col-span-2">
                <Fact label="Availability" value={<Tags items={app.availability} />} />
              </div>
              <Fact label="Could start" value={app.earliestStart} />
              <Fact label="Languages" value={app.languages} />
              <Fact label="Heard about us" value={app.heardAbout} />
              <Fact
                label="LinkedIn / website"
                value={
                  app.linkedinUrl && /^https?:\/\//i.test(app.linkedinUrl) ? (
                    <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-[#8A6D35] hover:underline inline-flex items-center gap-1 break-all">
                      <Linkedin className="w-3.5 h-3.5 flex-shrink-0" /> {app.linkedinUrl.replace(/^https?:\/\//, "")}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    ""
                  )
                }
              />
            </dl>
          </Panel>

          <Panel icon={MessageSquare} title={isCoaching ? "Why they want to coach here" : "Why they want to join"}>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
            {app.resume && (
              <a
                href={`/admin/hiring/applications/${app._id}/resume`}
                className="mt-5 flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-[#C5A464]/40 transition-colors"
              >
                <FileText className="w-5 h-5 text-[#C5A464]" />
                <span className="text-sm font-medium text-gray-800 truncate flex-1">{app.resume.fileName}</span>
                <span className="text-xs text-gray-400">{Math.max(1, Math.round(app.resume.size / 1024))} KB</span>
                <Download className="w-4 h-4 text-gray-400" />
              </a>
            )}
          </Panel>

          <Panel icon={Users} title="References">
            {app.references.length === 0 ? (
              <p className="text-sm text-gray-400">No references provided.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {app.references.map((ref, index) => (
                  <div key={index} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <p className="font-medium text-gray-900 text-sm">{ref.name}</p>
                    {ref.relationship && <p className="text-xs text-gray-500 mt-0.5">{ref.relationship}</p>}
                    <div className="mt-3 space-y-1 text-sm">
                      {ref.phone && (
                        <a href={`tel:${ref.phone}`} className="flex items-center gap-2 text-[#8A6D35] hover:underline">
                          <Phone className="w-3.5 h-3.5" /> {ref.phone}
                        </a>
                      )}
                      {ref.email && (
                        <a href={`mailto:${ref.email}`} className="flex items-center gap-2 text-[#8A6D35] hover:underline break-all">
                          <Mail className="w-3.5 h-3.5" /> {ref.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel icon={StickyNote} title="Notes & activity">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a private note: interview impressions, reference feedback, next steps…"
                rows={3}
                maxLength={4000}
                className={`${inputClass} flex-1 resize-y bg-gray-50/50`}
              />
              <Button onClick={submitNote} disabled={busy || !note.trim()} className={`${goldButton} sm:self-end h-10 px-5`}>
                Add note
              </Button>
            </div>
            <ol className="relative border-l border-gray-100 ml-2 space-y-5">
              {app.activity.map((entry) => (
                <li key={entry._id} className="ml-5 group">
                  <span
                    className={`absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      entry.kind === "note" ? "bg-[#C5A464]" : entry.kind === "email" ? "bg-sky-400" : "bg-gray-300"
                    }`}
                  />
                  {entry.kind === "note" ? (
                    <div className="rounded-xl bg-[#C5A464]/[0.06] border border-[#C5A464]/15 p-3">
                      <p className="text-sm text-gray-800 whitespace-pre-line">{entry.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-gray-400">
                          Note · {format(new Date(entry.at), "MMM d, yyyy h:mm a")}
                        </span>
                        <button
                          onClick={() => run(() => deleteApplicationNote(app._id, entry._id))}
                          className="text-[11px] text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">{entry.text}</p>
                      <span className="text-[11px] text-gray-400">{format(new Date(entry.at), "MMM d, yyyy h:mm a")}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Panel icon={Star} title="Your rating">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => handleRating(n)} className="p-0.5" aria-label={`Rate ${n} of 5`}>
                  <Star className={`w-7 h-7 transition-colors ${n <= app.rating ? "fill-[#C5A464] text-[#C5A464]" : "text-gray-200 hover:text-[#C5A464]/50"}`} />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Click the current rating again to clear it.</p>
          </Panel>

          <Panel
            icon={ShieldCheck}
            title="Player-safety checklist"
            action={<span className={`text-xs font-semibold ${checksDone === checks.length ? "text-emerald-600" : "text-gray-400"}`}>{checksDone}/{checks.length}</span>}
          >
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-[#C5A464] to-emerald-500 transition-all" style={{ width: `${(checksDone / checks.length) * 100}%` }} />
            </div>
            <ul className="space-y-2">
              {checks.map((key: ComplianceKey) => {
                const checked = app.compliance[key];
                const required = REQUIRED_BEFORE_HIRE.includes(key);
                return (
                  <li key={key}>
                    <label className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${checked ? "bg-emerald-50/60" : "hover:bg-gray-50"}`}>
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 accent-emerald-600"
                        checked={checked}
                        disabled={busy}
                        onChange={(e) => run(() => setComplianceItem(app._id, key, e.target.checked))}
                      />
                      <span className="text-sm text-gray-700">
                        {COMPLIANCE_ITEMS[key].label}
                        {required && <span className="block text-[11px] text-gray-400">Required before hire</span>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {app.safeSportStatus !== "current" && !app.compliance.safeSportVerified && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-4 flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                Applicant reported SafeSport as {SAFESPORT_STATUSES[app.safeSportStatus].toLowerCase()}.
              </p>
            )}
          </Panel>

          <Panel
            icon={CalendarClock}
            title="Interview"
            action={
              app.interview && !editingInterview ? (
                <button onClick={startEditingInterview} className="text-xs font-medium text-[#8A6D35] hover:underline">
                  Reschedule
                </button>
              ) : null
            }
          >
            {app.interview && !editingInterview ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-violet-50/60 border border-violet-100 p-4">
                  <p className="text-sm font-semibold text-gray-900">{formatWallClock(app.interview.scheduledAt)}</p>
                  {app.interview.location && <p className="text-sm text-gray-600 mt-1">{app.interview.location}</p>}
                  {app.interview.details && <p className="text-xs text-gray-500 mt-2 whitespace-pre-line">{app.interview.details}</p>}
                </div>
                <button
                  onClick={() => run(() => cancelInterview(app._id))}
                  disabled={busy}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Cancel interview
                </button>
              </div>
            ) : showInterviewForm ? (
              <form onSubmit={saveInterview} className="space-y-3">
                <div>
                  <label htmlFor="scheduledAt" className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Date & time (Central)</label>
                  <input
                    id="scheduledAt"
                    type="datetime-local"
                    required
                    value={interviewForm.scheduledAt}
                    onChange={(e) => setInterviewForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Location or meeting link</label>
                  <input
                    id="location"
                    value={interviewForm.location}
                    onChange={(e) => setInterviewForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Club office, or a video call link"
                    maxLength={300}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="details" className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Message to applicant</label>
                  <textarea
                    id="details"
                    rows={3}
                    value={interviewForm.details}
                    onChange={(e) => setInterviewForm((f) => ({ ...f, details: e.target.value }))}
                    placeholder="Optional: what to bring, who they will meet…"
                    maxLength={2000}
                    className={`${inputClass} resize-y`}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#C5A464]" checked={notifyInterview} onChange={(e) => setNotifyInterview(e.target.checked)} />
                  Email the invitation to {app.firstName}
                </label>
                <div className="flex gap-2 pt-1">
                  <Button type="submit" disabled={busy} className={`${goldButton} flex-1`}>
                    {app.interview ? "Update interview" : "Schedule interview"}
                  </Button>
                  {editingInterview && (
                    <Button type="button" variant="outline" className="rounded-xl" onClick={() => setEditingInterview(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-400">No interview scheduled.</p>
            )}
          </Panel>
        </div>
      </div>

      {/* Decline / hire confirmation */}
      <AlertDialog open={!!pendingStage} onOpenChange={(open) => !open && setPendingStage(null)}>
        <AlertDialogContent className="rounded-2xl">
          {pendingStage === "rejected" ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark as not selected?</AlertDialogTitle>
                <AlertDialogDescription>
                  {app.firstName} {app.lastName} will move out of the active pipeline. You can move them back at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 cursor-pointer">
                <input type="checkbox" className="mt-0.5 w-4 h-4 accent-[#C5A464]" checked={notifyDecline} onChange={(e) => setNotifyDecline(e.target.checked)} />
                <span className="text-sm text-gray-700">
                  Send a polite decline email to <strong>{app.email}</strong>
                  <span className="block text-xs text-gray-400 mt-0.5">A short, standard thank-you letter. It cannot be unsent.</span>
                </span>
              </label>
            </>
          ) : (
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Safety checks are not complete
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  <p>Before {app.firstName} works with players, these must be done:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {missingForHire.map((key) => (
                      <li key={key}>{COMPLIANCE_ITEMS[key].label}</li>
                    ))}
                  </ul>
                  <p className="mt-3">You can still mark them hired. The missing items will be recorded in their activity log.</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStage}
              className={pendingStage === "rejected" ? "bg-rose-500 hover:bg-rose-600 text-white rounded-xl" : `${goldButton}`}
            >
              {pendingStage === "rejected" ? "Mark not selected" : "Mark hired anyway"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes {app.firstName} {app.lastName}&apos;s application, resume and notes. This cannot be
              undone. To keep a record, mark them as not selected instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
              Delete application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="top-center" richColors />
    </div>
  );
}
