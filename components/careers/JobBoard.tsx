"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, CalendarClock, Clock, MapPin, Users } from "lucide-react";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  formatDateOnly,
  type Department,
  type PublicJob,
} from "@/lib/hiring";

const FILTERS: { key: "all" | Department; label: string }[] = [
  { key: "all", label: "All roles" },
  { key: "coaching", label: DEPARTMENTS.coaching },
  { key: "administration", label: DEPARTMENTS.administration },
];

const JobBoard = ({ jobs }: { jobs: PublicJob[] }) => {
  const [filter, setFilter] = useState<"all" | Department>("all");
  const visible = filter === "all" ? jobs : jobs.filter((job) => job.department === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter positions">
        {FILTERS.map((item) => {
          const count = item.key === "all" ? jobs.length : jobs.filter((j) => j.department === item.key).length;
          const active = filter === item.key;
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(item.key)}
              className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider border-2 transition-all duration-300 ${
                active
                  ? "bg-[#BD9B58] border-[#BD9B58] text-black"
                  : "bg-white border-gray-200 text-gray-700 hover:border-[#BD9B58]"
              }`}
            >
              {item.label}
              <span className={`ml-2 ${active ? "text-black/60" : "text-gray-400"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 bg-gray-50 p-10 md:p-14 text-center">
          <Briefcase className="w-10 h-10 text-[#BD9B58] mx-auto mb-4" />
          <h3 className="text-2xl font-bebas font-bold uppercase tracking-wider text-gray-900 mb-2">
            No {filter === "all" ? "" : `${DEPARTMENTS[filter].toLowerCase()} `}openings right now
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            We are always glad to meet great people. Send a general application and we will reach out when a
            role that fits you opens up.
          </p>
          <Link
            href={filter === "all" ? "/careers/apply" : `/careers/apply?department=${filter}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] text-black font-bold px-6 py-3 uppercase tracking-wider text-sm"
          >
            Submit a general application <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visible.map((job) => (
            <Link
              key={job._id}
              href={`/careers/${job.slug}`}
              className="group relative flex flex-col bg-white border-2 border-gray-200 hover:border-[#BD9B58] p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] transition-all duration-500" />

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BD9B58]">
                  {DEPARTMENTS[job.department]}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  {EMPLOYMENT_TYPES[job.employmentType]}
                </span>
              </div>

              <h3 className="text-3xl font-bebas font-bold uppercase tracking-wide text-gray-900 group-hover:text-[#BD9B58] transition-colors mb-3">
                {job.title}
              </h3>

              {job.summary && <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">{job.summary}</p>}

              <div className="mt-auto space-y-2 text-sm text-gray-500">
                {job.team && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#BD9B58]" /> {job.team}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#BD9B58]" /> {job.location || "Grand Island, NE"}
                </div>
                {job.startDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#BD9B58]" /> Starts {job.startDate}
                  </div>
                )}
                {job.applicationDeadline && (
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-[#BD9B58]" /> Apply by{" "}
                    {formatDateOnly(job.applicationDeadline)}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-900">View & apply</span>
                <ArrowRight className="w-5 h-5 text-[#BD9B58] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
