
import TeamSponsor from "@/components/landing/TeamSponsor";
import GoalkeepersSection from "@/components/landing/GoalKeepersSection";
import DefendersSection from "@/components/landing/DefendersSection";
import ForwardsSection from "@/components/landing/ForwardsSection";
import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";


const u11boys = () => {
    return (
        <div className="max-w-full overflow-hidden" style={{marginBottom: '70px' }}>

            {/* <MiniNavbarTeams /> */}


            <TeamSponsor />

            <GoalkeepersSection />
            <DefendersSection />
            <ForwardsSection />

            <TeamSponsor />
        </div>


  );
};

export default u11boys;
