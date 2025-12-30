

// Import Placeholder Image (Use One Image for Now)
const placeholderImage = "/footerimage.jpeg" // Replace with actual path

// Sample News Data
const newsItems = [
  {
    title: "EVERY WORD FROM RUBEN'S PRESS CONFERENCE",
    description: "Ruben Amorim did not pull any punches in his assessment of our current situation.",
    time: "1d",
    type: "news",
    tag:"Snapdragon",
    image: placeholderImage,
  },
  {
    title: "REPORT: UNITED 1 BRIGHTON 3",
    description: "The Reds slip to a home defeat against the Seagulls after a disappointing second half.",
    time: "1d",
    type: "match coverage",
    tag:"Snapdragon",
    image: placeholderImage,
  },
  {
    title: "SNAPDRAGON X DELL: DAVID & LEO'S STORY",
    description: "",
    time: "3d",
    type: "promotional",
    tag:"Snapdragon",
    image: placeholderImage,
  },
  {
    title: "Bruno dissects Sunday's defeat",
    description: "Our no.8 says United must continue to believe in our abilities on the pitch.",
    time: "1d",
    type: "news",
    tag:"Snapdragon",
    image: placeholderImage,
  },
  {
    title: "Old Trafford Task Force completes feasibility work",
    description: "The capacities of a regenerated or new-build stadium are revealed in the latest update, plus insights from key figures.",
    time: "3d",
    type: "news",
    tag:"Snapdragon",
    image: placeholderImage,
  },
  {
    title: "Would you like to play at Old Trafford?",
    description: "Marriott Bonvoy offer up exclusive once-in-a-lifetime prizes for United supporters.",
    time: "3d",
    type: "competition",
    tag:"Snapdragon",
    image: placeholderImage,
  }
];

const MissedItSection = () => {
  return (
    <div className="w-full px-10 md:px-28 py-12">
      {/* Header with Accent Line */}
      <div className="mb-6">
        <div className="w-16 h-[2px] bg-[#C5A464] mb-2"></div>
        <h2 className="text-2xl mb-6">IN CASE YOU MISSED IT</h2>
      </div>

      {/* Top 2 News Items (Split Image & Text) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {newsItems.slice(0, 2).map((news, index) => {
          // Split title into first word + rest of the sentence
          const words = news.title.split(" ");
          const firstWord = words.shift(); // Extract the first word
          const remainingTitle = words.join(" "); // Join the remaining words

          return (
            <div key={index} className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg overflow-hidden h-96">
              {/* Left Side - Image */}
              <div className="w-full h-1/3 sm:w-1/2 sm:h-full">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
              </div>

              {/* Right Side - Text */}
              <div className="w-1/2 p-4 flex flex-col justify-between">
                {/* Title with Accent Line */}
                <h3 className="text-black text-2xl font-bebas">
                  <span className="relative inline-block">
                    <span className="absolute -top-1 left-0 w-full h-[2px] bg-[#C5A464]"></span>
                    <span className="relative">{firstWord}</span>
                  </span>{" "}
                  {remainingTitle}
                </h3>

                <p className="text-gray-600 text-sm mt-2">{news.description}</p>
                <p className="text-gray-400 text-xs mt-auto">
                  {news.time} | {news.type}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom 4 News Items (Grid Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {newsItems.slice(2).map((news, index) => (
          index === 0 ? (
            // First card with special styling
            <div key={index} className="relative rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: '#181819' }}>
              {/* Background Image */}
              <img src={news.image} alt={news.title} className="w-full h-[200px] md:h-[300px] object-cover opacity-80" />

              {/* Yellow square indicator for first card only */}
              <span className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded" style={{ backgroundColor: '#181819' }}>
                {news.tag}
              </span>
              
              {/* Content area with larger title for first card */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black p-4 flex flex-col justify-end">
              <div className="  left-6 z-10">
                <div className="w-10 h-10 bg-[#C5A464] rounded"></div>
              </div>
                <h3 className="text-white text-xl md:text-2xl bottom-4 font-bebas uppercase">{news.title}</h3>
                <p className="text-gray-400 text-sm mt-2">
                  {news.time} | {news.type}
                </p>
              </div>
            </div>
          ) : (
            // New style for the rest of the cards
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden relative flex flex-col h-96">
              {/* Image */}
              <img src={news.image} alt={news.title} className="w-full sm:h-28 h-44 object-cover" />
              
              {/* Content */}
              <div className="p-3 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-sm  mb-1">{news.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{news.description}</p>
                </div>
              </div>
              
              {/* Time - Positioned in Bottom-Left */}
              <span className="text-xs text-gray-700 absolute bottom-2 left-2">
                {news.time} | {news.type}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default MissedItSection;