import { IFixture, ITimelineEvent } from "@/types/fixtures";
import { FC } from "react";

interface MatchTimelineProps {
  fixture: IFixture;
}

const MatchTimeline: FC<MatchTimelineProps> = ({ fixture }) => {
  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "GOAL":
        return "text-green-800";
      case "YELLOW_CARD":
        return "text-yellow-800";
      case "RED_CARD":
        return "text-red-800";
      case "SUBSTITUTION":
        return "text-gray-800";
      case "PENALTY_MISSED":
        return "text-gray-800";
      case "OWN_GOAL":
        return "text-purple-800";
      case "VAR":
        return "text-indigo-800";
      case "MATCH_START":
      case "HALF_TIME":
      case "MATCH_END":
        return "text-gray-800";
      default:
        return "text-gray-800";
    }
  };

  // Event type icons/indicators with styled badges
  const getEventIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    const badgeClass = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(type)}`;

    switch (normalizedType) {
      case "goal":
        return <span className={badgeClass}>⚽ Goal</span>;
      case "own goal":
      case "own_goal":
        return <span className={badgeClass}>⚽ OG</span>;
      case "yellow card":
      case "yellow_card":
        return <span className={badgeClass}>🟨 YC</span>;
      case "red card":
      case "red_card":
        return <span className={badgeClass}>🟥 RC</span>;
      case "substitution":
        return <span className={badgeClass}>↕️ Sub</span>;
      case "penalty scored":
      case "penalty_scored":
        return <span className={badgeClass}>⚽ Pen</span>;
      case "penalty missed":
      case "penalty_missed":
        return <span className={badgeClass}>❌ Pen</span>;
      case "var decision":
      case "var":
        return <span className={badgeClass}>📺 VAR</span>;
      default:
        return <span className={badgeClass}>{type}</span>;
    }
  };

  // Generate timeline markers
  const timeMarkers = [10, 20, 30, 40, 45, 50, 60, 70, 80, 90];

  // Determine if an event belongs to home or away team
  const isHomeTeamEvent = (event: ITimelineEvent) => event.team === fixture.homeTeam;

  // Parse time string to position percentage
  const timeToPosition = (timeStr: string) => {
    if (timeStr.includes('+')) {
      const [baseMin, addedMin] = timeStr.split('+');
      return ((parseInt(baseMin) + parseInt(addedMin) * 0.1) / 90) * 100;
    }
    return (parseInt(timeStr) / 90) * 100;
  };

  // Ensure timeline exists with a fallback to empty array
  const timelineEvents = fixture.timeline || [];

  return (
    <div className="relative mt-8 sm:-mt-20 mb-8 z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="border-b border-gray-200 mb-6">
            <h3 className="text-xl font-bold mb-2">Match Timeline</h3>
          </div>

          {/* Team headers - Home team on top, Away team on bottom */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center">
              <img
                src={fixture.homeTeamLogo}
                alt={fixture.homeTeam}
                className="w-6 h-6 mr-2"
              />
              <span className="text-sm">{fixture.homeTeam}</span>
            </div>

            {timelineEvents.length > 0 ? (
              /* Timeline visualization */
              <div className="relative pb-4 pt-4">
                {/* Home team events */}
                <div className="w-full h-8 flex items-end justify-between relative mb-1">
                  {timelineEvents.map((event, idx) => (
                    isHomeTeamEvent(event) && (
                      <div
                        key={`home-${idx}`}
                        className="absolute bottom-0 transform -translate-x-1/2 flex flex-col items-center"
                        style={{
                          left: `${timeToPosition(event.time)}%`,
                        }}
                      >
                        <div className="mb-1">{getEventIcon(event.type)}</div>
                        <div className="text-xs text-center">
                          <div>{event.time}'</div>
                          {event.player && <div className="font-medium">{event.player}</div>}
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Timeline bar */}
                <div className="relative">
                  <div className="h-6 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full relative">
                    {/* Time markers */}
                    {timeMarkers.map(minute => (
                      <div
                        key={minute}
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white font-medium"
                        style={{ left: `${(minute / 90) * 100}%` }}
                      >
                        {minute}
                      </div>
                    ))}

                    {/* Half time marker */}
                    <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                      <div className="bg-white text-green-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs">
                        HT
                      </div>
                    </div>

                    {/* Start and end markers */}
                    <div className="absolute -left-2 top-0 bottom-0 flex items-center">
                      <div className="bg-white text-green-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs">
                        KO
                      </div>
                    </div>
                    <div className="absolute -right-2 top-0 bottom-0 flex items-center">
                      <div className="bg-white text-green-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs">
                        FT
                      </div>
                    </div>
                  </div>
                </div>

                {/* Away team events */}
                <div className="w-full h-8 flex items-start justify-between relative mt-1">
                  {timelineEvents.map((event, idx) => (
                    !isHomeTeamEvent(event) && (
                      <div
                        key={`away-${idx}`}
                        className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center"
                        style={{
                          left: `${timeToPosition(event.time)}%`,
                        }}
                      >
                        <div className="text-xs text-center">
                          <div>{event.time}'</div>
                          {event.player && <div className="font-medium">{event.player}</div>}
                        </div>
                        <div className="mt-1">{getEventIcon(event.type)}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No timeline events available for this match yet.</p>
              </div>
            )}

            <div className="flex items-center">
              <img
                src={fixture.awayTeamLogo}
                alt={fixture.awayTeam}
                className="w-6 h-6 mr-2"
              />
              <span className="text-sm">{fixture.awayTeam}</span>
            </div>
          </div>

          {/* Legend - Updated with styled badges */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor("GOAL")}`}>⚽ Goal</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor("YELLOW_CARD")}`}>🟨 Yellow Card</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor("RED_CARD")}`}>🟥 Red Card</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor("SUBSTITUTION")}`}>↕️ Substitution</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor("PENALTY_SCORED")}`}>⚽ Penalty</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor("VAR")}`}>📺 VAR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchTimeline;