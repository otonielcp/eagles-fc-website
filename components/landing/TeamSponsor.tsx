import { Team } from "@/types/team";
import SafeImg from "./SafeImg";

interface TeamSponsorProps {
  team?: Team;
}

// Accept "example.com", "www.example.com" or a full http(s) URL; anything else → no link.
const normalizeWebsite = (website?: string): string | null => {
  const value = (website || "").trim();
  if (!value || value === "#") return null;
  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(url).href;
  } catch {
    return null;
  }
};

const TeamSponsor = ({ team }: TeamSponsorProps) => {
  const defaultLogo = "/clublogos/image4.png";
  const sponsorLogo = team?.sponsor?.logo || defaultLogo;
  const sponsorName = team?.sponsor?.name || "TEAM SPONSOR";
  const sponsorWebsite = normalizeWebsite(team?.sponsor?.website);

  const logo = (
    <SafeImg
      src={sponsorLogo}
      fallbackSrc={defaultLogo}
      alt={`${sponsorName} Logo`}
      className="w-full h-full object-cover"
    />
  );

  return (
    <div className="max-w-[1400px] w-11/12 md:w-9/12 mx-auto my-6 md:my-8">
      {sponsorWebsite ? (
        <a
          href={sponsorWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative h-[100px] md:h-[150px] lg:h-[200px] w-full"
        >
          {logo}
        </a>
      ) : (
        <div className="relative h-[100px] md:h-[150px] lg:h-[200px] w-full">{logo}</div>
      )}
    </div>
  );
};

export default TeamSponsor;
