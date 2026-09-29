import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, HeartHandshake, ShieldCheck, Trophy } from "lucide-react";
import { getOpenJobs } from "@/actions/careers";
import CareersHero from "@/components/careers/CareersHero";
import JobBoard from "@/components/careers/JobBoard";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Coach or work with Eagles FC in Grand Island, Nebraska. See open coaching and club administration positions and apply online.",
  openGraph: {
    title: "Careers | Eagles FC - Grand Island, NE",
    description: "Open coaching and club staff positions at Eagles FC in Grand Island, Nebraska.",
  },
};

const reasons = [
  {
    icon: Trophy,
    title: "Develop players",
    text: "Help young players grow their skills, confidence and love of the game, from their first touches to competitive soccer.",
  },
  {
    icon: GraduationCap,
    title: "Grow as a coach",
    text: "Work alongside experienced staff and keep learning, whether you are earning your first license or your next one.",
  },
  {
    icon: HeartHandshake,
    title: "Serve the community",
    text: "Be part of a club that brings families together across Grand Island and central Nebraska.",
  },
  {
    icon: ShieldCheck,
    title: "Safety first",
    text: "Every coach and staff member is SafeSport trained and background checked. Players' wellbeing comes before everything.",
  },
];

const steps = [
  { title: "Apply online", text: "Pick a position below, or send a general application." },
  { title: "Conversation", text: "If your background fits, we will reach out for a short call." },
  { title: "Interview", text: "Meet our staff. Coaches may be asked to run a short session." },
  { title: "Clearance & onboarding", text: "Background check, SafeSport, and welcome to the club." },
];

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <div className="max-w-full overflow-hidden bg-white">
      <CareersHero openCount={jobs.length} />

      {/* Why join */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]" />
              <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Why Eagles FC</span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas font-black text-black uppercase tracking-wider">
              More than a <span className="text-[#BD9B58]">job</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white border-2 border-gray-200 p-7 hover:border-[#BD9B58] transition-colors duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#BD9B58] to-[#D4AF37] flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-bebas font-bold uppercase tracking-wider text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]" />
              <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Join our staff</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas font-black text-black uppercase tracking-wider">
              Open <span className="text-[#BD9B58]">positions</span>
            </h2>
          </div>
          <JobBoard jobs={jobs} />
        </div>
      </section>

      {/* Hiring process */}
      <section className="py-20 bg-[#181819] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent" />
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bebas font-black uppercase tracking-wider text-center mb-14">
            How hiring <span className="text-[#BD9B58]">works</span>
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <div className="text-6xl font-bebas font-black text-[#BD9B58]/30 leading-none mb-3">0{index + 1}</div>
                <h3 className="text-2xl font-bebas font-bold uppercase tracking-wider mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* General application + EEO */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bebas font-black text-black uppercase tracking-wider mb-4">
            Don&apos;t see the right <span className="text-[#BD9B58]">fit?</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            We are always looking for coaches, trainers and volunteers. Tell us about yourself and we will reach out
            when something opens up.
          </p>
          <Link
            href="/careers/apply"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black font-bold px-10 py-4 uppercase tracking-wider transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            Submit a general application
          </Link>
          <p className="text-xs text-gray-400 mt-12 max-w-2xl mx-auto leading-relaxed">
            Eagles FC is an equal opportunity organization. We welcome applicants of every race, color, religion,
            sex, national origin, age, disability, sexual orientation and gender identity. All positions that
            involve contact with players require a completed background check and SafeSport training.
          </p>
        </div>
      </section>
    </div>
  );
}
