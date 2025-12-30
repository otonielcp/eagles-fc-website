
const selectMainImage = "/select-main.jpeg"
const selectSecondImage = "/select-second.jpeg"

const Select = () => {
  return (
    <div className="relative max-w-4xl py-16 mx-auto flex flex-col md:flex-row items-center sm:items-start">
      {/* Main Content Div - Left side */}
      <div className="bg-white rounded-lg shadow-lg p-10 sm:pr-32 sm:p-14 sm:w-2/3 relative z-10">
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
      <div className="relative w-full sm:w-[60%] sm:absolute sm:top-32 sm:-right-5 mt-8 sm:mt-0 flex justify-center sm:block">
        {/* Main Image */}
        <img
          src={selectMainImage}
          alt="Select Program Main"
          className="w-[80%] h-[80%] object-cover rounded-lg shadow-lg md:ml-16 lg:ml-32 sm:ml-16"
        />
        {/* Secondary Image - Positioned over main image */}
        <img
          src={selectSecondImage}
          alt="Select Program Secondary"
          className="absolute bottom-0 sm:bottom-0 left-16 sm:left-52  h-[20%] object-cover border-white border-t-8 border-r-8 rounded-bl-lg shadow-lg z-10"
        />
      </div>
    </div>
  );
};

export default Select;