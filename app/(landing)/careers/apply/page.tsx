import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ApplicationForm from "@/components/careers/ApplicationForm";

export const metadata: Metadata = {
  title: "General Application | Careers",
  description:
    "Interested in coaching or working with Eagles FC in Grand Island, Nebraska? Submit a general application and we will contact you when a role opens.",
};

type Props = { searchParams: Promise<{ department?: string }> };

export default async function GeneralApplicationPage({ searchParams }: Props) {
  const { department } = await searchParams;

  return (
    <div className="bg-gray-50">
      <section className="relative bg-[#181819] text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#BD9B58]/10 rounded-full blur-[120px]" />
        <div className="relative max-w-5xl mx-auto px-6 py-14 md:py-20">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#BD9B58] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Careers
          </Link>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-black uppercase tracking-wider leading-none mb-4">
            General <span className="text-[#BD9B58]">application</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            No opening that fits right now? Tell us about yourself. We keep every application on file and reach out
            when a coaching or staff role opens.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ApplicationForm job={null} defaultDepartment={department === "administration" ? "administration" : "coaching"} />
        </div>
      </section>
    </div>
  );
}
