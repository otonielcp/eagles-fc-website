import { getPortfolioLogosByCategory } from "@/actions/sponsorsLogo"

// Placeholder Partner Logo
// const partner1 = "/mainpartners/partner5.png"

// Generate a placeholder array of partners
// const partners = Array.from({ length: 72 }, () => partner1);

const PremierPartners = async () => {
  const partners = await getPortfolioLogosByCategory("Partner");

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
      <div className="px-2 sm:px-10 md:px-40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-7 place-items-center">
        {partners.map((partner, index) => (
          <img
            key={index}
            src={partner.image}
            alt={partner.name}
            className="h-24 sm:h-16 md:h-28 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default PremierPartners;