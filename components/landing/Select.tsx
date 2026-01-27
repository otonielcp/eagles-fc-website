
const selectMainImage = "/select-main.jpeg"
const selectSecondImage = "/select-second.jpeg"

const Select = () => {
  return (
    <div className="relative max-w-4xl py-8 sm:py-12 md:py-16 mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center md:items-start">
      {/* Main Content Div - Left side */}
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-10 md:pr-32 md:p-14 w-full md:w-2/3 relative z-10">
        <h2 className="text-gray-500 text-2xl font-semibold">Program</h2>
        <h3 className="text-2xl italic font-semibold text-[#C5A464] mb-4">SELECT</h3>
        <p className="text-gray-600 text-xs mb-4 leading-relaxed">
          The Select Program of Eagles FC's premier youth development pathway, designed for highly skilled and committed players who aspire to compete at the highest levels. This program provides an intensive training environment, ensuring players have the technical, tactical, and physical foundation needed to succeed in collegiate, semi-professional, and professional soccer.
        </p>

        {/* Program Highlights */}
        <h4 className="font-bold text-gray-500 text-sm mb-2">Program Highlights:</h4>
        <ul className="text-xs text-gray-600   space-y-4 mb-4">
          <li>
            <span className="font-semibold text-[#C5A464]">Elite Level Coaching:</span> Sessions led by experienced, licensed coaches focused on advanced skill development and tactical awareness.
          </li>
          <li>
            <span className="font-semibold text-[#C5A464]">College & Pro Exposure:</span> Opportunities to compete in national tournaments, showcases, and scouting events.
          </li>
          <li>
            <span className="font-semibold text-[#C5A464]">High-Performance Training:</span> Access to strength & conditioning programs, video analysis, and individualized development plans.
          </li>
          <li>
            <span className="font-semibold text-[#C5A464]">USYS National League:</span> Compete in the USYS National League against top-tier teams, preparing for the next level of play.
          </li>
        </ul>

        {/* Pathway Section */}
        <h4 className="font-bold text-gray-500 text-sm mb-2">Pathway to the Next Level</h4>
        <p className="text-gray-600 text-xs mb-6 leading-relaxed">
          The Select Program is the bridge between youth soccer and the next stage of your soccer career. Our teams compete in the USYS National League, the premier youth soccer league in the United States, providing players with high-level competition and exposure to college and professional scouts. Players in this program train and compete at the highest standards, ensuring they are ready to succeed on and off the field.
        </p>

        {/* Sign Up Button */}
        <div className="flex justify-center">
          <button className="bg-[#C5A464] text-white px-5 py-2 rounded-tr-lg rounded-bl-lg text-sm font-semibold shadow-md hover:bg-[#A8824B] transition">
            SIGN UP
          </button>
        </div>
      </div>

      {/* Image Container - Right side for large screens, stacked below for small screens */}
      <div className="relative w-full md:w-[60%] md:absolute md:top-32 md:-right-5 mt-8 md:mt-0 flex justify-center md:block">
        {/* Main Image */}
        <img
          src={selectMainImage}
          alt="Select Program Main"
          className="w-full max-w-[300px] sm:max-w-none sm:w-[80%] h-auto object-cover rounded-lg shadow-lg md:ml-16 lg:ml-32"
        />
        {/* Secondary Image - Hidden on mobile, shown on tablet+ */}
        <img
          src={selectSecondImage}
          alt="Select Program Secondary"
          className="hidden sm:block absolute bottom-0 left-1/4 sm:left-32 md:left-52 h-[20%] object-cover border-white border-t-8 border-r-8 rounded-bl-lg shadow-lg z-10"
        />
      </div>
    </div>
  );
};

export default Select;