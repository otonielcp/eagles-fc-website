import { getLatestFullTimeMatch } from "@/actions/fixture";
import { IFixture } from "@/types/fixtures";
import MatchReviewButton from "./MatchReviewButton";

const GameResult = async () => {
  const result: IFixture | null = await getLatestFullTimeMatch();
  
  // Return early if no match found
  if (!result) {
    return (
      <div className="relative w-full py-16 md:py-24 min-h-[400px] flex items-center justify-center text-white" style={{ backgroundColor: '#181819' }}>
        <div className="text-center">
          <p className="text-xl text-gray-400">No recent match results available</p>
        </div>
      </div>
    );
  }
  
  const gameresultbg = result.matchImage;

  // Determine winner for styling
  const isHomeWinner = result.homeScore > result.awayScore;
  const isAwayWinner = result.awayScore > result.homeScore;

  return (
    <div
      className="relative w-full py-16 md:py-24 min-h-[800px] md:min-h-[900px] flex items-center justify-center text-white bg-cover bg-center overflow-hidden"
      style={{
        backgroundPosition: 'center center',
        backgroundImage: `linear-gradient(135deg, rgba(24, 24, 25, 0.85) 0%, rgba(24, 24, 25, 0.75) 50%, rgba(24, 24, 25, 0.85) 100%), url(${gameresultbg})`,
      }}
    >
      {/* Decorative Gold Overlay Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(189, 155, 88, 0.1) 10px,
            rgba(189, 155, 88, 0.1) 20px
          )`,
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Section: League Logo & Status */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
      {/* League Logo */}
          {result.leagueLogo && (
            <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <img 
                src={result.leagueLogo} 
                alt="League Logo" 
                className="h-12 md:h-16 lg:h-20 object-contain drop-shadow-2xl" 
              />
            </div>
          )}

          {/* Match Status Badge */}
          <div 
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 mb-4 backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(24, 24, 25, 0.9)',
              borderColor: '#BD9B58',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#BD9B58] animate-pulse"></span>
            <span className="text-sm md:text-base font-bold uppercase tracking-wider text-[#BD9B58]">
              {result.status || 'Full Time'}
            </span>
          </div>
        </div>

        {/* Match Score Section - Enhanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center mb-10 md:mb-12">
          
          {/* Left: Home Team (Eagles FC) */}
          <div className="flex flex-col items-center lg:items-end space-y-4 order-2 lg:order-1">
            {/* Team Logo */}
            <div className="relative group">
              <img 
                src={result.homeTeamLogo || '/EAGLES-CREST.png'} 
                alt={`${result.homeTeam} Logo`} 
                className="relative h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300" 
              />
            </div>

            {/* Team Name */}
            <div className="text-center lg:text-right">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bebas uppercase tracking-wide mb-2 drop-shadow-lg">
                {result.homeTeam}
              </h3>
            </div>
          </div>

          {/* Center: Score Display */}
          <div className="flex flex-col items-center space-y-6 order-1 lg:order-2">
            {/* Score Numbers */}
            <div className="flex items-center gap-4 md:gap-8">
              {/* Home Score */}
              <div className="relative group">
                <div 
                  className={`relative text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bebas font-bold transition-all duration-300 ${
                    isHomeWinner ? 'text-[#BD9B58]' : 'text-white'
                  }`}
                  style={{
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {result.homeScore}
                </div>
              </div>

              {/* Separator */}
              <div className="text-4xl md:text-5xl lg:text-6xl font-bebas text-[#BD9B58] font-light">
                -
              </div>

              {/* Away Score */}
              <div className="relative group">
                <div 
                  className={`relative text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bebas font-bold transition-all duration-300 ${
                    isAwayWinner ? 'text-[#BD9B58]' : 'text-white'
                  }`}
                  style={{
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {result.awayScore}
                </div>
              </div>
            </div>

            {/* Competition Info */}
            {result.competition && (
              <div className="text-center">
                <p className="text-xs md:text-sm uppercase tracking-widest text-[#BD9B58] font-semibold">
                  {result.competition}
                </p>
              </div>
            )}
          </div>

          {/* Right: Away Team */}
          <div className="flex flex-col items-center lg:items-start space-y-4 order-3">
            {/* Team Logo */}
            <div className="relative group">
              <img 
                src={result.awayTeamLogo || '/default.jpg'} 
                alt={`${result.awayTeam} Logo`} 
                className="relative h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
            
            {/* Team Name */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bebas uppercase tracking-wide mb-2 drop-shadow-lg">
                {result.awayTeam}
              </h3>
            </div>
          </div>
        </div>

        {/* Match Review Button - Enhanced */}
        <MatchReviewButton matchId={result._id} />
      </div>
    </div>
  );
};

export default GameResult;
