
const partnerImage = "/parrtner-hero.png"

const PartnerHero = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center relative">
      {/* Left Section - Text Content */}
      <div className="w-full md:w-1/2 px-6 md:px-0 md:ml-2 lg:ml-40 md:pr-0 py-8 md:py-0 bg-white">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-500">
          Partner with Eagles FC Team!
        </h2>
        <p className="text-gray-900 text-xs pr-2 mt-6 md:mt-0 lg:mt-10 leading-relaxed">
          Join forces with Eagles FC, one of the fastest-growing and most
          respected soccer clubs in Nebraska. As a leading force in player
          development and competitive soccer, we provide a unique platform for
          businesses to connect with our passionate community while supporting
          the growth of the sport.
        </p>
        <p className="text-gray-900 text-xs mt-4 leading-relaxed">
          Our partnerships offer customized marketing solutions that help
          businesses increase visibility, engage with local audiences, and
          align with a club dedicated to excellence, leadership, and community
          impact.
        </p>
      </div>

      {/* Right Section - Image with Diagonal Cut */}
      <div className="w-full h-64 md:h-auto relative">
        <img
          src={partnerImage}
          alt="Partner with Eagles FC"
          className="w-full h-full object-cover hidden md:block"
          style={{
            clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />
        <img
          src={partnerImage}
          alt="Partner with Eagles FC"
          className="w-full h-full object-cover md:hidden"
        />
      </div>
    </div>
  );
};

export default PartnerHero;
