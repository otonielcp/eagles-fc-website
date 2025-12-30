
const playerImage = "/default.jpg" // Replace with actual image path

// Sample Goalkeepers Data
const goalkeepers = [
  { number: "19", name: "ISAIAH CORTEZ", image: playerImage },
  { number: "22", name: "TOM HEATON", image: playerImage },
  { number: "24", name: "ANDRE ONANA", image: playerImage },
];

const GoalkeepersSection = () => {
  return (
    <div className="w-full px-28 mx-4 md:px-28 py-8">
      {/* Section Title */}
      <h2 className="text-lg text-gray-500 font-semibold uppercase mb-4 border-b pb-2">
        Goalkeepers
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6  h-full justify-start">
        {goalkeepers.map((player, index) => (
          <a href="/playerprofilepage">
            <div
            key={index}
            className="rounded-lg overflow-hidden shadow-lg aspect-square" style={{ backgroundColor: '#181819' }}
          >
            {/* Player Image */}
            <div className="relative">
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full object-cover"
              />
              {/* Player Details Overlay */}
              <div className="absolute bottom-6 left-2  sm:bottom-24 sm:left-4 md:bottom-8  md:left-4  lg:bottom-10  lg:left-4  xl:bottom-14  xl:left-4 2xl:bottom-24  2xl:left-4 mb-4">
                <p className="text-white  text-xs md:text-xs xl:text-xl   2xl:text-xl ">{player.number}</p>
                <div className="w-4 h-[2px] bg-[#C5A464] xl:w-6 2xl:w-8 mb-1"></div>
                <h3 className="text-white text-xs  sm:text-4xl md:text-lg xl:text-3xl 2xl:text-4xl font-bold ">{player.name.includes(" ") ? player.name.split(" ").map((word, i) => (
                    <div key={i}>{word}</div>
                  )) : player.name}</h3>
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
