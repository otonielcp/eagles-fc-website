import { getPortfolioLogosByCategory } from "@/actions/sponsorsLogo"
import SafeImg from "./SafeImg"

// Placeholder Partner Logo
// const partner1 = "/mainpartners/partner5.png"

// Generate a placeholder array of partners
// const partners = Array.from({ length: 72 }, () => partner1);

const PremierPartners = async () => {
  const partners = await getPortfolioLogosByCategory("Partner");
  if (!partners.length) return null;

  return (
    <div className="w-full py-6 sm:py-10 px-4 sm:px-10 md:px-28">
      {/* Header with Gold Accent Lines */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="w-1/4 sm:w-1/3 h-[1px] bg-[#C5A464]"></div>
        <h2 className="text-[#C5A464] text-[10px] sm:text-xs uppercase mx-2 sm:mx-4 font-semibold text-center">
          PREMIER PARTNERS & OFFICIAL SUPPLIERS
        </h2>
        <div className="w-1/4 sm:w-1/3 h-[1px] bg-[#C5A464]"></div>
      </div>

      {/* Grid Layout for Logos */}
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16">
        {partners.map((partner, index) => (
          <SafeImg
            key={index}
            src={partner.image}
            alt={partner.name}
            fallbackSrc={null}
            className="h-16 sm:h-20 md:h-24 w-auto max-w-[220px] object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default PremierPartners;