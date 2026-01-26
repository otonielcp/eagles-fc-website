
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
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 py-12">
          {/* Section Title */}
          <h2 className="text-xl md:text-2xl text-[#C5A464] font-bold uppercase mb-8 border-b-2 border-gray-300 pb-4">
            Forwards
          </h2>
    
          {/* Grid Layout - Bigger Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Forwards.map((player, index) => (
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
    
export default ForwardsSection;
