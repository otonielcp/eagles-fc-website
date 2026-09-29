import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Banknote, CalendarClock, Clock, MapPin, Users } from "lucide-react";
import { getOpenJobBySlug } from "@/actions/careers";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { DEPARTMENTS, EMPLOYMENT_TYPES, formatDateOnly, type PublicJob } from "@/lib/hiring";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getOpenJobBySlug(slug);
  if (!job) return { title: "Position Not Found" };
  const description = job.summary || `Apply for ${job.title} at Eagles FC in Grand Island, Nebraska.`;
  return {
    title: `${job.title} | Careers`,
    description,
    openGraph: { title: `${job.title} | Eagles FC Careers`, description },
  };
}

const GOOGLE_EMPLOYMENT_TYPE: Record<PublicJob["employmentType"], string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  seasonal: "TEMPORARY",
  volunteer: "VOLUNTEER",
  contract: "CONTRACTOR",
};

/** schema.org JobPosting so open roles can appear in Google's job search. */
function jobPostingJsonLd(job: PublicJob) {
  const [locality, region] = (job.location || "Grand Island, NE").split(",").map((part) => part.trim());
  const sections = [
    job.description,
    job.responsibilities.length ? `Responsibilities:\n- ${job.responsibilities.join("\n- ")}` : "",
    job.requirements.length ? `Requirements:\n- ${job.requirements.join("\n- ")}` : "",
  ].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: sections.join("\n\n") || job.summary,
    datePosted: job.createdAt.slice(0, 10),
    ...(job.applicationDeadline ? { validThrough: `${job.applicationDeadline}T23:59:59-06:00` } : {}),
    employmentType: GOOGLE_EMPLOYMENT_TYPE[job.employmentType],
    hiringOrganization: {
      "@type": "SportsOrganization",
      name: "Eagles Football Club",
      sameAs: "https://eaglesfcgi.org",
      logo: "https://eaglesfcgi.org/LOGO%20(2).png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        addressRegion: region || "NE",
        addressCountry: "US",
      },
    },
  };
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-3xl font-bebas font-bold uppercase tracking-wider text-gray-900 mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-gray-700 leading-relaxed">
            <span className="mt-2.5 w-2 h-2 bg-[#BD9B58] flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getOpenJobBySlug(slug);
  if (!job) notFound();

  const facts = [
    { icon: Clock, label: "Type", value: EMPLOYMENT_TYPES[job.employmentType] },
    { icon: MapPin, label: "Location", value: job.location || "Grand Island, NE" },
    { icon: Users, label: "Team / age group", value: job.team },
    { icon: Banknote, label: "Compensation", value: job.compensation },
    { icon: CalendarClock, label: "Start", value: job.startDate },
    {
      icon: CalendarClock,
      label: "Apply by",
      value: job.applicationDeadline ? formatDateOnly(job.applicationDeadline) : "",
    },
  ].filter((fact) => fact.value);

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        // JSON.stringify does not escape "<", so a title containing "</script>" could break out.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(job)).replace(/</g, "\\u003c") }}
      />

      {/* Header */}
      <section className="relative bg-[#181819] text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#BD9B58]/10 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 md:py-20">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#BD9B58] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> All positions
          </Link>
          <div className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em] mb-3">{DEPARTMENTS[job.department]}</div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-black uppercase tracking-wider leading-none mb-6">
            {job.title}
          </h1>
          {job.summary && <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-8">{job.summary}</p>}
          <a
            href="#apply"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black font-bold px-8 py-4 uppercase tracking-wider transition-all duration-300"
          >
            Apply now
          </a>
        </div>
      </section>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {job.description && (
            <section className="mb-10">
              <h2 className="text-3xl font-bebas font-bold uppercase tracking-wider text-gray-900 mb-4">About the role</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</div>
            </section>
          )}
          <ListSection title="What you'll do" items={job.responsibilities} />
          <ListSection title="What we're looking for" items={job.requirements} />
          <ListSection title="Nice to have" items={job.preferred} />
          <ListSection title="What we offer" items={job.benefits} />
        </div>

        <aside className="lg:sticky lg:top-28 self-start">
          <div className="bg-gray-50 border-2 border-gray-200 p-6">
            <div className="h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] -mx-6 -mt-6 mb-6" />
            <h2 className="text-2xl font-bebas font-bold uppercase tracking-wider text-gray-900 mb-5">At a glance</h2>
            <dl className="space-y-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="w-5 h-5 text-[#BD9B58] flex-shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</dt>
                    <dd className="text-gray-900 font-medium">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <a
              href="#apply"
              className="mt-6 block text-center bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] text-black font-bold px-6 py-3 uppercase tracking-wider"
            >
              Apply for this role
            </a>
          </div>
        </aside>
      </div>

      {/* Application */}
      <section id="apply" className="bg-gray-50 py-16 md:py-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]" />
              <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Apply</span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bebas font-black text-black uppercase tracking-wider">
              Join the <span className="text-[#BD9B58]">Eagles</span>
            </h2>
            <p className="text-gray-600 mt-3">Fields marked <span className="text-red-500">*</span> are required. It takes about 10 minutes.</p>
          </div>
          <ApplicationForm job={{ slug: job.slug, title: job.title, department: job.department }} />
        </div>
      </section>
    </div>
  );
}
