
const recreationalImage = "/recreational.jpeg"

const Recreational = () => {
  return (
    <div className="relative max-w-5xl py-6 md:py-10 mx-4 md:mx-auto">
      {/* Main Content Div */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-20 md:pr-36 w-full md:w-2/3 relative z-10">
        <h2 className="text-gray-500 text-xl md:text-2xl font-semibold">Programs</h2>
        <h3 className="text-xl md:text-2xl italic font-semibold text-[#C5A464] mb-4">RECREATIONAL</h3>
        <p className="text-gray-600 text-xs mb-4 leading-relaxed">
          Our Recreational Program is the perfect starting point for players of all skill levels who want to enjoy soccer in a fun, inclusive, and supportive environment. Designed to emphasize learning and enjoyment over competition, this program helps young athletes build confidence, make new friends, and develop a lifelong love for the game.
        </p>

        {/* Program Highlights */}
        <h4 className="font-bold text-gray-500 text-sm mb-2">Program Highlights:</h4>
        <ul className="text-xs text-gray-600  space-y-2 mb-4">
          <li><span className="font-semibold text-[#C5A464]">Skill Development:</span> Introduction to dribbling, passing, shooting, and ball control.</li>
          <li><span className="font-semibold text-[#C5A464]">Teamwork & Sportsmanship:</span> Players learn the value of cooperation, respect, and fair play.</li>
          <li><span className="font-semibold text-[#C5A464]">Small-Sided Games:</span> Fun and engaging formats to maximize participation and touches on the ball.</li>
          <li><span className="font-semibold text-[#C5A464]">Active & Healthy Lifestyle:</span> Encourages physical activity, coordination, and motor skill development.</li>
        </ul>

        {/* A Program for Everyone */}
        <h4 className="font-bold text-gray-500 text-sm mb-2">A Program for Everyone</h4>
        <p className="text-gray-600 text-xs mb-6 leading-relaxed">
          Whether your child is taking their first steps into soccer or simply looking for an enjoyable and structured playing experience, our Recreational Program provides the perfect balance of skill-building and fun. This program allows students to learn the game at their own pace while being part of a positive soccer community.
        </p>

        {/* Sign Up Button */}
        <div className="flex justify-center">
          <button className="bg-[#C5A464] text-white px-5 py-2 rounded-tr-lg rounded-bl-lg text-sm font-semibold shadow-md hover:bg-[#A8824B] transition">
            SIGN UP
          </button>
        </div>
      </div>

      {/* Image Div - Hidden on mobile, maintains desktop position */}
      <div className="hidden md:block absolute top-32 -right-96 w-[75%] h-[90%] z-10">
        <img
          src={recreationalImage}
          alt="Recreational Program"
          className="w-[60%] h-[80%] object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Mobile Image - Only visible on small screens */}
      <div className="md:hidden w-full mt-6">
        <img
          src={recreationalImage}
          alt="Recreational Program"
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Recreational;