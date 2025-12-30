

const NextMatch = () => {
  return (
    <div className="text-white py-12 px-6" style={{ backgroundColor: '#181819' }}>
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Next Match</h2>

        {/* Match Details */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Team 1 */}
          <div className="flex flex-col items-center">
            <img
              src="/assets/teams/team1.png"
              alt="Team 1 Logo"
              className="h-20 w-20 object-contain"
            />
            <p className="text-xl font-semibold mt-2">Team 1</p>
          </div>

          {/* Match Info */}
          <div className="text-center">
            <p className="text-gray-400 mb-2">Premier League</p>
            <p className="text-2xl font-bold">VS</p>
            <p className="text-gray-400 mt-2">January 30, 2025 | 5:00 PM</p>
            <p className="text-gray-400">Eagles FC Stadium</p>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center">
            <img
              src="/assets/teams/team2.png"
              alt="Team 2 Logo"
              className="h-20 w-20 object-contain"
            />
            <p className="text-xl font-semibold mt-2">Team 2</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8">
          <a
            href="#"
            className="inline-block text-white py-3 px-6 rounded-lg transition" style={{ backgroundColor: '#181819' }}
          >
            Buy Tickets
          </a>
        </div>
      </div>
    </div>
  );
};

export default NextMatch;
