"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Plus, Trash2, Upload } from "lucide-react";
import { submitApplication, type ApplicationPayload } from "@/actions/careers";
import {
  ADMIN_SKILLS,
  AGE_GROUPS,
  AVAILABILITY_OPTIONS,
  COACHING_LICENSES,
  DEPARTMENTS,
  HEARD_ABOUT_OPTIONS,
  PLAYING_LEVELS,
  RESUME_MAX_BYTES,
  RESUME_TYPES,
  SAFESPORT_STATUSES,
  type Department,
  type SafeSportStatus,
} from "@/lib/hiring";

interface Props {
  /** The posting being applied for, or null for a general application. */
  job: { slug: string; title: string; department: Department } | null;
  defaultDepartment?: Department;
}

type Reference = { name: string; relationship: string; phone: string; email: string };
const emptyReference = (): Reference => ({ name: "", relationship: "", phone: "", email: "" });

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-200 bg-white focus:border-[#BD9B58] focus:outline-none transition-colors duration-300";
const labelClass = "block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2";

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-10">
      <legend className="text-xl font-bebas font-bold text-black uppercase tracking-wider mb-5 flex items-center gap-3">
        <span className="w-8 h-8 bg-[#BD9B58] text-white flex items-center justify-center font-bold">{number}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  hint,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  hint?: string;
}) {
  return (
    <div role="group" aria-label={label}>
      <span className={labelClass}>{label}</span>
      {hint && <p className="text-xs text-gray-500 -mt-1 mb-2">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(option)}
              className={`px-3.5 py-2 text-sm border-2 transition-all duration-200 ${
                on
                  ? "bg-[#BD9B58]/10 border-[#BD9B58] text-gray-900 font-semibold"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {on && <span className="mr-1.5 text-[#BD9B58]">✓</span>}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YesNo({
  name,
  label,
  value,
  onChange,
  required,
}: {
  name: string;
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  required?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <span className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="flex gap-3">
        {[true, false].map((option) => (
          <label
            key={String(option)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 cursor-pointer transition-all ${
              value === option ? "border-[#BD9B58] bg-[#BD9B58]/10 font-semibold" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={name}
              className="accent-[#BD9B58]"
              checked={value === option}
              onChange={() => onChange(option)}
              required={required}
            />
            {option ? "Yes" : "No"}
          </label>
        ))}
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ApplicationForm = ({ job, defaultDepartment = "coaching" }: Props) => {
  const [department, setDepartment] = useState<Department>(job?.department ?? defaultDepartment);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "NE",
    zip: "",
    yearsExperience: "",
    playingLevel: "",
    software: "",
    languages: "",
    earliestStart: "",
    coverLetter: "",
    linkedinUrl: "",
    heardAbout: "",
    website: "", // honeypot
  });
  const [licenses, setLicenses] = useState<(typeof COACHING_LICENSES)[number][]>([]);
  const [ageGroups, setAgeGroups] = useState<(typeof AGE_GROUPS)[number][]>([]);
  const [adminSkills, setAdminSkills] = useState<(typeof ADMIN_SKILLS)[number][]>([]);
  const [availability, setAvailability] = useState<(typeof AVAILABILITY_OPTIONS)[number][]>([]);
  const [safeSportStatus, setSafeSportStatus] = useState<SafeSportStatus | "">("");
  const [cprCertified, setCprCertified] = useState<boolean | null>(null);
  const [workAuthorized, setWorkAuthorized] = useState<boolean | null>(null);
  const [isAdult, setIsAdult] = useState(false);
  const [backgroundCheckAck, setBackgroundCheckAck] = useState(false);
  const [certify, setCertify] = useState(false);
  const [references, setReferences] = useState<Reference[]>([emptyReference(), emptyReference()]);
  const [resume, setResume] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const isCoaching = department === "coaching";
  const positionTitle = job?.title ?? `General Application: ${DEPARTMENTS[department]}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (value: T) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const updateReference = (index: number, field: keyof Reference, value: string) =>
    setReferences((prev) => prev.map((ref, i) => (i === index ? { ...ref, [field]: value } : ref)));

  const showError = (message: string) => {
    setError(message);
    requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    if (!RESUME_TYPES[file.type]) {
      showError("Please upload your resume as a PDF or Word document.");
      return;
    }
    if (file.size > RESUME_MAX_BYTES) {
      showError(`Your resume is ${formatBytes(file.size)}. The limit is 3 MB.`);
      return;
    }
    setError("");
    setResume(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!safeSportStatus) return showError("Please tell us your SafeSport training status.");
    if (workAuthorized === null) return showError("Please tell us whether you are authorized to work in the U.S.");
    if (isCoaching && cprCertified === null) return showError("Please tell us whether you are CPR / First Aid certified.");

    const filledReferences = references.filter((r) => r.name.trim());
    if (references.some((r) => !r.name.trim() && (r.phone.trim() || r.email.trim() || r.relationship.trim()))) {
      return showError("Each reference needs a name.");
    }

    const payload: ApplicationPayload = {
      ...form,
      jobSlug: job?.slug ?? "",
      department,
      yearsExperience: Number(form.yearsExperience || 0),
      playingLevel: form.playingLevel as ApplicationPayload["playingLevel"],
      licenses: isCoaching ? licenses : [],
      ageGroups: isCoaching ? ageGroups : [],
      adminSkills: isCoaching ? [] : adminSkills,
      availability,
      safeSportStatus,
      cprCertified: !!cprCertified,
      workAuthorized,
      isAdult: isAdult as true,
      backgroundCheckAck: backgroundCheckAck as true,
      certify: certify as true,
      references: filledReferences,
    };

    const data = new FormData();
    data.append("payload", JSON.stringify(payload));
    if (resume) data.append("resume", resume);

    setIsSubmitting(true);
    try {
      const result = await submitApplication(data);
      if (result.success) {
        setReferenceCode(result.referenceCode);
        requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      } else {
        showError(result.message);
      }
    } catch {
      showError("We could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (referenceCode) {
    return (
      <div ref={topRef} className="bg-white border-2 border-gray-200 p-8 md:p-12 shadow-lg text-center scroll-mt-28">
        <div className="h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] mb-10 -mx-8 md:-mx-12 -mt-8 md:-mt-12" />
        <CheckCircle2 className="w-16 h-16 text-[#BD9B58] mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl font-bebas font-black uppercase tracking-wider text-black mb-4">
          Application received
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Thank you, {form.firstName}! Your application for <strong>{positionTitle}</strong> is in. We sent a
          confirmation to <strong>{form.email}</strong> and will reach out if your background is a match.
        </p>
        <div className="inline-block bg-gray-50 border-2 border-gray-200 px-8 py-4 mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Reference number</div>
          <div className="text-2xl font-bold tracking-wider text-gray-900">{referenceCode}</div>
        </div>
        <div>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] text-black font-bold px-8 py-4 uppercase tracking-wider"
          >
            Back to careers
          </Link>
        </div>
      </div>
    );
  }

  let section = 0;

  return (
    <div ref={topRef} className="scroll-mt-28">
      <form onSubmit={handleSubmit} className="relative bg-white border-2 border-gray-200 p-6 sm:p-8 md:p-12 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] mb-8" />

        <div className="mb-10 p-4 bg-gray-50 border-l-4 border-[#BD9B58]">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Applying for</div>
          <div className="text-lg font-bold text-gray-900">{positionTitle}</div>
        </div>

        {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
        </div>

        {!job && (
          <Section number={++section} title="Area of interest">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(DEPARTMENTS) as Department[]).map((key) => (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-5 border-2 cursor-pointer transition-all ${
                    department === key ? "border-[#BD9B58] bg-[#BD9B58]/10" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="department"
                    className="mt-1 accent-[#BD9B58]"
                    checked={department === key}
                    onChange={() => setDepartment(key)}
                  />
                  <span>
                    <span className="block font-bold text-gray-900">{DEPARTMENTS[key]}</span>
                    <span className="block text-sm text-gray-500 mt-0.5">
                      {key === "coaching"
                        ? "Head, assistant and goalkeeper coaches, trainers"
                        : "Registration, operations, communications, events"}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Section>
        )}

        <Section number={++section} title="About you">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <Field id="firstName" label="First name" required>
              <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} autoComplete="given-name" maxLength={60} required />
            </Field>
            <Field id="lastName" label="Last name" required>
              <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} autoComplete="family-name" maxLength={60} required />
            </Field>
            <Field id="email" label="Email" required>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} autoComplete="email" placeholder="you@example.com" maxLength={200} required />
            </Field>
            <Field id="phone" label="Phone" required>
              <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} autoComplete="tel" placeholder="(308) 555-0123" maxLength={30} required />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field id="city" label="City">
              <input id="city" name="city" value={form.city} onChange={handleChange} className={inputClass} autoComplete="address-level2" maxLength={80} />
            </Field>
            <Field id="state" label="State">
              <input id="state" name="state" value={form.state} onChange={handleChange} className={inputClass} autoComplete="address-level1" maxLength={40} />
            </Field>
            <Field id="zip" label="ZIP">
              <input id="zip" name="zip" value={form.zip} onChange={handleChange} className={inputClass} autoComplete="postal-code" inputMode="numeric" maxLength={15} />
            </Field>
          </div>
        </Section>

        <Section number={++section} title={isCoaching ? "Coaching experience" : "Experience & skills"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <Field id="yearsExperience" label={isCoaching ? "Years coaching" : "Years of relevant experience"} required>
              <input id="yearsExperience" type="number" min={0} max={60} name="yearsExperience" value={form.yearsExperience} onChange={handleChange} className={inputClass} required />
            </Field>
            {isCoaching ? (
              <Field id="playingLevel" label="Highest level played">
                <select id="playingLevel" name="playingLevel" value={form.playingLevel} onChange={handleChange} className={inputClass}>
                  <option value="">Select…</option>
                  {PLAYING_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field id="software" label="Software & tools" hint="e.g. Google Workspace, Excel, registration platforms, Canva">
                <input id="software" name="software" value={form.software} onChange={handleChange} className={inputClass} maxLength={300} />
              </Field>
            )}
          </div>

          {isCoaching ? (
            <div className="space-y-6">
              <ChipGroup label="Licenses & certifications" hint="Select all you currently hold." options={COACHING_LICENSES} selected={licenses} onToggle={toggle(setLicenses)} />
              <ChipGroup label="Age groups you have coached" options={AGE_GROUPS} selected={ageGroups} onToggle={toggle(setAgeGroups)} />
              <div className="sm:w-1/2">
                <YesNo name="cprCertified" label="Current CPR / First Aid certification?" value={cprCertified} onChange={setCprCertified} required />
              </div>
            </div>
          ) : (
            <ChipGroup label="Areas you have experience in" options={ADMIN_SKILLS} selected={adminSkills} onToggle={toggle(setAdminSkills)} />
          )}

          <div className="mt-6">
            <Field id="languages" label="Languages spoken" hint="e.g. English, Spanish">
              <input id="languages" name="languages" value={form.languages} onChange={handleChange} className={inputClass} maxLength={200} />
            </Field>
          </div>
        </Section>

        <Section number={++section} title="Player safety & eligibility">
          <p className="text-gray-600 text-sm mb-6 max-w-3xl">
            Our players are children. Every coach and staff member completes U.S. Center for SafeSport training and
            passes a background check before working with them. We will guide you through both if you are selected.
          </p>

          <div role="radiogroup" aria-label="SafeSport training status" className="mb-6">
            <span className={labelClass}>
              SafeSport training status <span className="text-red-500">*</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(SAFESPORT_STATUSES) as SafeSportStatus[]).map((key) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-4 py-3 border-2 cursor-pointer transition-all ${
                    safeSportStatus === key ? "border-[#BD9B58] bg-[#BD9B58]/10 font-semibold" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input type="radio" name="safeSportStatus" className="accent-[#BD9B58]" checked={safeSportStatus === key} onChange={() => setSafeSportStatus(key)} required />
                  {SAFESPORT_STATUSES[key]}
                </label>
              ))}
            </div>
          </div>

          <div className="sm:w-1/2 mb-6">
            <YesNo name="workAuthorized" label="Legally authorized to work in the U.S.?" value={workAuthorized} onChange={setWorkAuthorized} required />
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 accent-[#BD9B58]" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} required />
              <span className="text-gray-700">
                I am 18 years of age or older. <span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 accent-[#BD9B58]" checked={backgroundCheckAck} onChange={(e) => setBackgroundCheckAck(e.target.checked)} required />
              <span className="text-gray-700">
                If selected, I agree to complete a background check and SafeSport training (and keep both current)
                before working with players. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>
        </Section>

        <Section number={++section} title="Availability">
          <div className="space-y-6">
            <ChipGroup label="When are you available?" options={AVAILABILITY_OPTIONS} selected={availability} onToggle={toggle(setAvailability)} />
            <div className="sm:w-1/2">
              <Field id="earliestStart" label="When could you start?" hint="e.g. Immediately, Spring season, March 2027">
                <input id="earliestStart" name="earliestStart" value={form.earliestStart} onChange={handleChange} className={inputClass} maxLength={60} />
              </Field>
            </div>
          </div>
        </Section>

        <Section number={++section} title="Tell us about yourself">
          <div className="space-y-6">
            <Field
              id="coverLetter"
              label={isCoaching ? "Why do you want to coach at Eagles FC?" : "Why do you want to join Eagles FC?"}
              required
              hint={`${form.coverLetter.length}/5000. Share your experience, your ${isCoaching ? "coaching philosophy" : "strengths"}, and what you would bring to the club.`}
            >
              <textarea id="coverLetter" name="coverLetter" rows={7} value={form.coverLetter} onChange={handleChange} className={`${inputClass} resize-y`} minLength={20} maxLength={5000} required />
            </Field>

            <div>
              <span className={labelClass}>Resume</span>
              {resume ? (
                <div className="flex items-center justify-between gap-4 p-4 border-2 border-[#BD9B58] bg-[#BD9B58]/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-6 h-6 text-[#BD9B58] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{resume.name}</div>
                      <div className="text-xs text-gray-500">{formatBytes(resume.size)}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setResume(null)} className="text-gray-400 hover:text-red-500 p-2" aria-label="Remove resume">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label htmlFor="resume" className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 hover:border-[#BD9B58] bg-gray-50 cursor-pointer transition-colors text-center">
                  <Upload className="w-7 h-7 text-[#BD9B58]" />
                  <span className="font-semibold text-gray-800">Upload your resume</span>
                  <span className="text-xs text-gray-500">PDF or Word, up to 3 MB. Optional, but recommended.</span>
                </label>
              )}
              <input id="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleResume} className="sr-only" />
            </div>

            <div className="sm:w-1/2">
              <Field id="linkedinUrl" label="LinkedIn or website">
                <input id="linkedinUrl" type="url" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className={inputClass} placeholder="https://" maxLength={300} />
              </Field>
            </div>
          </div>
        </Section>

        <Section number={++section} title="References">
          <p className="text-gray-600 text-sm mb-6">
            Up to three people who can speak to your work{isCoaching ? " with players" : ""}. We will only contact them if you move forward.
          </p>
          <div className="space-y-5">
            {references.map((ref, index) => (
              <div key={index} className="p-5 bg-gray-50 border-2 border-gray-200 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Reference {index + 1}</span>
                  {references.length > 1 && (
                    <button type="button" onClick={() => setReferences((prev) => prev.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500" aria-label={`Remove reference ${index + 1}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input aria-label={`Reference ${index + 1} name`} placeholder="Full name" value={ref.name} onChange={(e) => updateReference(index, "name", e.target.value)} className={inputClass} maxLength={100} />
                  <input aria-label={`Reference ${index + 1} relationship`} placeholder="Relationship (e.g. Club director)" value={ref.relationship} onChange={(e) => updateReference(index, "relationship", e.target.value)} className={inputClass} maxLength={100} />
                  <input aria-label={`Reference ${index + 1} phone`} type="tel" placeholder="Phone" value={ref.phone} onChange={(e) => updateReference(index, "phone", e.target.value)} className={inputClass} maxLength={30} />
                  <input aria-label={`Reference ${index + 1} email`} type="email" placeholder="Email" value={ref.email} onChange={(e) => updateReference(index, "email", e.target.value)} className={inputClass} maxLength={200} />
                </div>
              </div>
            ))}
          </div>
          {references.length < 3 && (
            <button type="button" onClick={() => setReferences((prev) => [...prev, emptyReference()])} className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#BD9B58] hover:text-[#9A7B3E]">
              <Plus className="w-4 h-4" /> Add another reference
            </button>
          )}
        </Section>

        <Section number={++section} title="Almost done">
          <div className="sm:w-1/2 mb-6">
            <Field id="heardAbout" label="How did you hear about us?">
              <select id="heardAbout" name="heardAbout" value={form.heardAbout} onChange={handleChange} className={inputClass}>
                <option value="">Select…</option>
                {HEARD_ABOUT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 accent-[#BD9B58]" checked={certify} onChange={(e) => setCertify(e.target.checked)} required />
            <span className="text-gray-700">
              I confirm the information in this application is true and complete, and I understand that false
              information may disqualify me. <span className="text-red-500">*</span>
            </span>
          </label>
        </Section>

        <div ref={errorRef} aria-live="assertive">
          {error && (
            <div className="mb-6 p-4 text-center font-semibold bg-red-100 text-red-700 border-2 border-red-300">{error}</div>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-3 text-black font-bold text-base md:text-lg px-12 py-4 uppercase tracking-wider shadow-xl transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] hover:-translate-y-1"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
