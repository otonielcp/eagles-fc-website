
const juniorImage = "/junior-main.jpeg"
const juniorSecondImage = "/junior-second.jpeg"

const JuniorAcademy = () => {
  return (
    <div className="relative max-w-4xl py-8 md:py-16 mx-4 md:mx-auto">
      {/* Desktop Image Container - Left side */}
      <div className="hidden md:block absolute top-32 left-5 w-[50%] h-[90%] z-20">
        {/* Main Image */}
        <img
          src={juniorImage}
          alt="Junior Academy Main"
          className="w-[80%] h-[80%] object-cover rounded-lg shadow-lg"
        />
        {/* Secondary Image - Positioned over main image */}
        <img
          src={juniorSecondImage}
          alt="Junior Academy Secondary"
          className="absolute bottom-32 w-[55%] h-[20%] object-cover border-white border-t-8 border-r-8 rounded-bl-lg shadow-lg"
        />
      </div>

      {/* Mobile Images - Only visible on small screens */}
      <div className="md:hidden mb-6 relative">
        <img
          src={juniorImage}
          alt="Junior Academy Main"
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <img
          src={juniorSecondImage}
          alt="Junior Academy Secondary"
          className="absolute -bottom-4 right-4 w-32 h-24 object-cover border-white border-t-4 border-r-4 rounded-bl-lg shadow-lg"
        />
      </div>

      {/* Main Content Div - Right side */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-14 md:pl-32 w-full md:w-2/3 relative z-10 md:ml-auto">
        <h2 className="text-gray-500 text-xl md:text-2xl font-semibold text-center md:text-right">Programs</h2>
        <h3 className="text-xl md:text-2xl italic font-semibold text-center md:text-right text-[#C5A464] mb-4">JUNIOR ACADEMY</h3>
        <p className="text-gray-600 text-xs mb-4 leading-relaxed">
          Our Junior Academy is the foundation of Eagles FC's player development pathway, designed to introduce young athletes to structured training in a fun, engaging, and supportive environment. At this critical stage, players develop essential technical skills while gaining a deeper understanding of the game.
        </p>

        {/* Program Highlights */}
        <h4 className="font-bold text-gray-500 text-sm mb-2">Program Highlights:</h4>
        <ul className="text-xs text-gray-600   space-y-4 mb-4">
          <li>
            <span className="font-semibold text-[#C5A464]">Technical Development:</span> Dribbling, passing, ball control, and shooting fundamentals.
          </li>
          <li>
            <span className="font-semibold text-[#C5A464]">Motor Skills & Coordination:</span> Enhancing agility, balance, and reaction time through age-appropriate drills.
          </li>
          <li>
            <span className="font-semibold text-[#C5A464]">Game Awareness:</span> Learning movement, positioning, and decision-making in small-sided games.
          </li>
          <li>
            <span className="font-semibold text-[#C5A464]">Confidence & Enjoyment:</span> Encouraging creativity, teamwork, and a lifelong love for soccer.
          </li>
        </ul>

        {/* Building the Future Section */}
        <h4 className="font-bold text-gray-500 text-sm mb-2">Building the Future of Soccer</h4>
        <p className="text-gray-600 text-xs mb-4 leading-relaxed">
          The Junior Academy is not just about skill building—it's about developing a passion for the game and preparing young players for long-term success. Our expert coaches use age-appropriate training methods to ensure each child learns, grows, and enjoys the game in a positive and nurturing atmosphere.
        </p>

        <p className="text-gray-600 text-xs mb-6 leading-relaxed">
          For players looking to advance into competitive soccer, the Junior Academy provides the technical foundation and game awareness needed to transition into higher levels of play.
        </p>

        {/* Sign Up Button */}
        <div className="flex justify-center">
          <button className="bg-[#C5A464] text-white px-5 py-2 rounded-tr-lg rounded-bl-lg text-sm font-semibold shadow-md hover:bg-[#A8824B] transition">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuniorAcademy;