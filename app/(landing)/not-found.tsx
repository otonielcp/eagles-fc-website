import Link from "next/link";

export default function LandingNotFound() {
  return (
    <section className="relative bg-[#181819] text-white overflow-hidden min-h-[60vh] flex items-center">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent" />
      <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em] mb-4">404</div>
        <h1 className="text-5xl md:text-6xl font-bebas font-black uppercase tracking-wider leading-none mb-6">
          Page not found
        </h1>
        <p className="text-gray-300 text-lg mb-10">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black font-bold px-8 py-4 uppercase tracking-wider transition-all duration-300"
          >
            Back to home
          </Link>
          <Link
            href="/teams"
            className="inline-flex items-center gap-3 border-2 border-[#BD9B58] hover:bg-[#BD9B58]/10 text-white font-bold px-8 py-4 uppercase tracking-wider transition-all duration-300"
          >
            View teams
          </Link>
        </div>
      </div>
    </section>
  );
}
