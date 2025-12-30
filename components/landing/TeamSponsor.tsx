import { Team } from "@/types/team";
import Link from "next/link";

interface TeamSponsorProps {
  team?: Team;
}

const TeamSponsor = ({ team }: TeamSponsorProps) => {
  const defaultLogo = "/clublogos/image4.png";
  const sponsorLogo = team?.sponsor?.logo || defaultLogo;
  const sponsorName = team?.sponsor?.name || "TEAM SPONSOR";
  const sponsorWebsite = team?.sponsor?.website || "#";

  return (
    <div className="max-w-[1400px] w-11/12 md:w-9/12 mx-auto my-6 md:my-8">
      <a 
        href={`https://${sponsorWebsite}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative h-[100px] md:h-[150px] lg:h-[200px] w-full"
      >
        <img
          src={sponsorLogo}
          alt={`${sponsorName} Logo`}
          className="w-full h-full object-cover"
        />
      </a>
    </div>
  );
};

export default TeamSponsor;