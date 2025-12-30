
const playerImage = "/default.jpg" // Replace with actual image path

// Sample Defenders Data
const Forwards = [
  { number: "2", name: "VICTOR LINDELOF", image: playerImage },
  { number: "3", name: "NOUSSAIR MAZRAOUI", image: playerImage },
  { number: "4", name: "MATTHIJS DE LIGT", image: playerImage },
  { number: "5", name: "HARRY MAGUIRE", image: playerImage },
  { number: "6", name: "LISANDRO MARTINEZ", image: playerImage },
  { number: "12", name: "TYRELL MALACIA", image: playerImage },
  { number: "15", name: "LENY YORO", image: playerImage },
  { number: "20", name: "DIOGO DALOT", image: playerImage },
  { number: "23", name: "LUKE SHAW", image: playerImage },
  { number: "35", name: "JONNY EVANS", image: playerImage },
  { number: "41", name: "HARRY AMASS", image: playerImage },
];

const ForwardsSection = () => {
    return (
        <div className="w-full px-28 mx-4 md:px-28 py-8">
          {/* Section Title */}
          <h2 className="text-lg text-gray-500 font-semibold uppercase mb-4 border-b pb-2">
            Forwards
          </h2>
    
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6  h-full justify-start">
        {Forwards.map((player, index) => (
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
    
export default ForwardsSection;
