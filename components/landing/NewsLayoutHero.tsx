
const heroImage = "/newshero.png" // Update with actual path

// Title (Will be dynamic in the future)
const NEWS_TITLE = "AMAD X GARNACHO: EXCLUSIVE INTERVIEW OUT NOW";

const NewsLayoutHero = () => {
  return (
    <div
      className="relative w-full h-[500px] bg-cover bg-center flex items-end"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 opacity-0"></div>

      {/* Vignette (Gradient Fade from Bottom) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>

      {/* Text Content */}
      <div className="relative mb-12 w-full px-8 py-6 text-center text-white">
        <h1 className="text-7xl md:text-5xl font-bebas uppercase">{NEWS_TITLE}</h1>
      </div>
    </div>
  );
};

export default NewsLayoutHero;
