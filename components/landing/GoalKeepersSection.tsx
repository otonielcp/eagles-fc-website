
const playerImage = "/default.jpg" // Replace with actual image path

// Sample Goalkeepers Data
const goalkeepers = [
  { number: "19", name: "ISAIAH CORTEZ", image: playerImage },
  { number: "22", name: "TOM HEATON", image: playerImage },
  { number: "24", name: "ANDRE ONANA", image: playerImage },
];

const GoalkeepersSection = () => {
  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 py-12">
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl text-[#C5A464] font-bold uppercase mb-8 border-b-2 border-gray-300 pb-4">
        Goalkeepers
      </h2>

      {/* Grid Layout - Bigger Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {goalkeepers.map((player, index) => (
          <a href="/playerprofilepage" key={index}>
            <div
              className="rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 aspect-[3/4] group" 
              style={{ backgroundColor: '#181819' }}
            >
              {/* Player Image */}
              <div className="relative h-full">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Player Details Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-2xl md:text-3xl font-black mb-2">{player.number}</p>
                  <div className="w-12 h-[3px] bg-gradient-to-r from-[#C5A464] to-[#D4B574] mb-3"></div>
                  <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">
                    {player.name.includes(" ") ? player.name.split(" ").map((word, i) => (
                      <div key={i}>{word}</div>
                    )) : player.name}
                  </h3>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GoalkeepersSection;
