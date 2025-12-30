import Image from 'next/image';
import Link from 'next/link';
import { Team } from '@/types/team';

interface TeamClassesProps {
  teams: Team[];
}

const TeamClasses = ({ teams }: TeamClassesProps) => {
  // If no teams are provided, show a placeholder message
  if (!teams || teams.length === 0) {
    return (
      <div className="w-9/12 mx-auto py-12 text-center">
        <h3 className="text-xl font-semibold">No active teams found</h3>
        <p className="text-gray-500 mt-2">Check back later for updated team information.</p>
      </div>
    );
  }

  return (
    <div className="w-9/12 mx-auto py-12">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Image Section */}
            <div className="relative">
              {team.image ? (
                <img
                  src={team.image}
                  alt={team.name}
                  width={400}
                  height={250}
                  className="w-full h-[250px] object-cover object-top"
                />
              ) : (
                <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">{team.shortName}</span>
                </div>
              )}
            </div>

            {/* Text & Button Section */}
            <div className="p-4 h-36 flex flex-col items-center">
              <div className="flex justify-between w-full text-lg text-gray-600">
                <h2 className="font-bold">{team.shortName}</h2>
                <p className="text-sm font-semibold">{team.category}</p>
              </div>

              {/* Updated Link to use new dynamic route */}
              <Link href={`/team/${team._id}`}>
                <button className="mt-14 bg-[#C5A464] text-white px-5 py-2 rounded-md text-xs font-semibold shadow-md hover:bg-[#A8824B] transition">
                  View Roster
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamClasses;
