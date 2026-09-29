import Image from "next/image";
import Link from "next/link";

// The crest, not a team photo: every roster is U7–U15, so club pages avoid
// publishing images of players.
const crest = "/mainlogo.png";

const CareersHero = ({ openCount }: { openCount: number }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#181819] text-white">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent shadow-[0_0_20px_rgba(189,155,88,0.5)]" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#BD9B58]/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#BD9B58]/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]" />
            <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Careers at Eagles FC</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bebas font-black uppercase tracking-wider leading-none mb-6">
            <span className="block">Coach. Lead.</span>
            <span className="block bg-gradient-to-r from-[#BD9B58] via-[#D4AF37] to-[#BD9B58] bg-clip-text text-transparent">
              Build the future.
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            We are looking for coaches and club staff who want to develop young players and grow soccer in
            Grand Island. If you care about kids, the game and doing things the right way, we would love to hear
            from you.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#openings"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black font-bold px-8 py-4 uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(189,155,88,0.3)]"
            >
              {openCount > 0 ? `View ${openCount} open ${openCount === 1 ? "position" : "positions"}` : "View openings"}
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <Link
              href="/careers/apply"
              className="inline-flex items-center gap-3 border-2 border-[#BD9B58] hover:bg-[#BD9B58]/10 text-white font-bold px-8 py-4 uppercase tracking-wider transition-all duration-300"
            >
              General application
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-2 justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 bg-[#BD9B58]/20 blur-3xl rounded-full" />
            <Image src={crest} alt="Eagles FC crest" fill sizes="320px" className="relative object-contain drop-shadow-2xl" priority />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
