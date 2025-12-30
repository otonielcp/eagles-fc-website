import { IFixture } from "@/types/fixtures";

const GameResultHero = async ({
    result
}: {
    result: IFixture
}) => {
    const gameresultbg = result.matchImage;

    return (
        <div
            className="relative w-full py-12 min-h-[700px] flex flex-col justify-center items-center text-white bg-cover bg-center"
            style={{
                backgroundPosition: 'top center',
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${gameresultbg})`,
            }}
        >
            {/* League Logo */}
            <img src={result.leagueLogo} alt="League Logo" className="h-16 mb-4" />

            {/* Match Status */}
            <div className="text-white px-4 py-1 border text-lg font-semibold mb-4" style={{ backgroundColor: '#181819', borderColor: '#181819' }}>
                {result.status}
            </div>

            {/* Match Score & Teams */}
            <div className="flex flex-col md:flex-row items-center justify-center w-full">

                {/* Team 1 */}
                <div className="flex flex-col md:flex-row items-center gap-3 justify-end w-[700px]">
                    <span className="text-4xl md:text-5xl lg:text-7xl font-bebas text-center">{result.homeTeam}</span>
                    <img src={result.homeTeamLogo} alt={`${result.homeTeam} Logo`} className="h-12 w-12 md:h-16 md:w-16" />
                    <span className="text-4xl md:text-5xl lg:text-7xl font-bebas">{result.homeScore}</span>
                </div>

                {/* Score Separator */}
                <span className="text-4xl md:text-5xl font-bebas my-2 md:my-0 mx-4">-</span>

                {/* Team 2 */}
                <div className="flex flex-col md:flex-row items-center gap-3 justify-start w-[700px]">
                    <span className="text-4xl md:text-5xl lg:text-7xl font-bebas">{result.awayScore}</span>
                    <img src={result.awayTeamLogo} alt={`${result.awayTeam} Logo`} className="h-12 w-12 md:h-16 md:w-16" />
                    <span className="text-4xl md:text-5xl lg:text-7xl font-bebas text-center">{result.awayTeam}</span>
                </div>
            </div>
        </div>
    );
};

export default GameResultHero;
