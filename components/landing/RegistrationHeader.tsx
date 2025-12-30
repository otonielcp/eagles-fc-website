

const RegistrationHeader = () => {
  return (
    <header className="w-full bg-gradient-to-r from-[#D2D2D2] via-[#E5E5E5] to-[#D2D2D2] border-b border-gray-300 shadow-lg sticky top-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative">
        {/* Gold accent line at bottom */}
        <div className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#C5A464] to-transparent opacity-70"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 bg-white bg-opacity-10 backdrop-blur-sm sm:px-6 py-4 sm:py-3 rounded-lg">
          {/* Left side - Club Name */}
          <div className="w-full sm:w-auto transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 text-center sm:text-left tracking-wider relative">
              EAGLES FOOTBALL CLUB
              <span className="absolute -bottom-1 left-0 w-0 sm:w-full h-0.5 bg-[#C5A464] transform scale-x-0 sm:group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
            </h1>
          </div>

          {/* Right side - Registration Title and Tagline */}
          <div className="w-full sm:w-auto text-center sm:text-right transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#C5A464] tracking-wide">
              PLAYER REGISTRATION
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#706C6C] mt-1 italic">
              Soar high and bring home victory!
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RegistrationHeader;