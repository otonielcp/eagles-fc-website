import { getTwoUpcomingMatches } from "@/actions/fixture";
import { IFixture } from "@/types/fixtures";

const MatchCard = ({ team1Logo, team2Logo, matchInfo, league, team1Name, team2Name, competitionType }: {
  team1Logo: string,
  team2Logo: string,
  matchInfo: string,
  league: string,
  team1Name: string,
  team2Name: string,
  competitionType: string
}) => {
  return (
    <>
      <div className=" items-center  border border-gray-50 space-y-1  rounded-lg bg-white w-full p-3">
        <div className="grid grid-cols-[25%_50%_25%] space-x-2 justify-between w-full">
          <div className="h-full w-full flex items-center justify-center">
            <img src={team1Logo} alt={team1Name} className="h-24 w-24 object-contain" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm sm:text-base font-bold mb-1">{competitionType}</div>
            <div className="text-[#BD9B58] text-sm sm:text-lg font-bold">VS</div>
            <div className="text-center mt-1">
              <p className="font-medium text-xs text-gray-500 sm:text-sm ">{matchInfo}</p>
              <p className="text-xs text-gray-700">{league}</p>
            </div>
          </div>
          <div className="h-full w-full flex items-center justify-center">
            <img src={team2Logo} alt={team2Name} className="h-24 w-24 object-contain" />
          </div>
        </div>
      </div>
    </>
  );
};

const UpcomingMatches = async () => {
  const matches: IFixture[] = await getTwoUpcomingMatches();

  // Helper function to parse date without timezone issues
  const parseLocalDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date;
  };

  // Helper function to format date as-is without timezone conversion
  const formatDateAsIs = (dateString: string) => {
    const date = parseLocalDate(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayNum}, ${year}`;
  };

  return (
    <div className="py-2 px-4 bg-white flex flex-col sm:flex-row items-center sm:items-start w-full">
      {/* Right Side - Matches */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <MatchCard
              key={index}
              team1Logo={match.homeTeamLogo}
              team2Logo={match.awayTeamLogo}
              team1Name={match.homeTeam}
              team2Name={match.awayTeam}
              matchInfo={formatDateAsIs(match.date)}
              league={match.competition}
              competitionType={match.competitionType}
            />
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center py-8">
            <p className="text-gray-500 text-lg font-medium">No upcoming matches</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingMatches;
