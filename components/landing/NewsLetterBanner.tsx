import { getActiveTeams } from '@/actions/team';

// Import Image
const defaultLogo = "/clublogos/image4.png" // Replace with actual path

const NewsletterBanner = async () => {
  // Find the first team with an active sponsor
  const teams = await getActiveTeams();
  const teamWithSponsor = teams.find(team =>
    team.sponsor?.isActive
  );

  const sponsorImage = teamWithSponsor?.sponsor?.isActive ? teamWithSponsor.sponsor.logo : defaultLogo;

  return (
    <div className="max-w-[1400px] mx-auto w-11/12 md:w-9/12">
      <div
        className="h-[200px] flex items-center justify-between text-white py-2 sm:py-2 md:py-2 2xl:py-4 relative px-6"
        style={{
          backgroundImage: `url(${sponsorImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
        }}
      >
      </div>
    </div>
  );
};

export default NewsletterBanner;
