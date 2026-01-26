import { getActiveTeams } from '@/actions/team';

const defaultLogo = "/clublogos/image4.png";

const MainSponsorBanner = async () => {
  // Find the first team with an active sponsor
  const teams = await getActiveTeams();
  const teamWithSponsor = teams.find(team =>
    team.sponsor?.isActive
  );

  const sponsorImage = teamWithSponsor?.sponsor?.isActive ? teamWithSponsor.sponsor.logo : defaultLogo;

  return (
    <div className="w-full py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Sponsor Banner */}
        <div className="relative overflow-hidden shadow-xl group bg-black">
          {/* Top gold accent line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent z-20"></div>
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#BD9B58]/5 via-transparent to-[#BD9B58]/5"></div>
          
          {/* Content Container */}
          <div className="relative flex items-center justify-center py-16 md:py-20 lg:py-24 px-8">
            {/* Decorative corner elements */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#BD9B58]/30"></div>
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#BD9B58]/30"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#BD9B58]/30"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#BD9B58]/30"></div>
            
            {/* Sponsor Image */}
            <img
              src={sponsorImage}
              alt="Main Sponsor"
              className="max-h-[180px] md:max-h-[220px] lg:max-h-[280px] w-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
              style={{
                filter: 'drop-shadow(0 6px 30px rgba(189, 155, 88, 0.4))'
              }}
            />
          </div>
          
          {/* Bottom gold accent line */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent z-20"></div>
        </div>
      </div>
    </div>
  );
};

export default MainSponsorBanner;
