import { getPortfolioLogosByCategory } from "@/actions/sponsorsLogo"

// Import Partner Logos
// const partner1 = "/mainpartners/partner1.png"
// const partner2 = "/mainpartners/partner2.png"
// const partner3 = "/mainpartners/partner3.png"
// const partner4 = "/mainpartners/partner4.png"

const MainPartners = async () => {
  const mainPartners = await getPortfolioLogosByCategory("Primary");

  return (
    <div className="w-full py-4 pb-6" style={{ backgroundColor: '#181819' }}>
      {/* Header with Gold Accent Lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-1/3 h-[1px] bg-[#C5A464]"></div>
        <h2 className="text-[#C5A464] text-xs uppercase mx-4">Main Partners</h2>
        <div className="w-1/3 h-[1px] bg-[#C5A464]"></div>
      </div>

      {/* Partners Logos */}
      <div className="flex justify-center items-center gap-10 px-2 flex-wrap">
        {mainPartners.map((partner) => (
          <img key={partner._id} src={partner.image} alt={partner.name} className="h-16 object-contain" />
        ))}
        {/* <img src={partner1} alt="Partner 1" className="h-16 object-contain" />
        <img src={partner2} alt="Partner 2" className="h-12 object-contain" />
        <img src={partner3} alt="Partner 3" className="h-12 object-contain" />
        <img src={partner4} alt="Partner 4" className="h-12 object-contain" /> */}
      </div>
    </div>
  );
};

export default MainPartners;
