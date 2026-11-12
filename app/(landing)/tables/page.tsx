import type { Metadata } from "next";
import Standing from "@/components/landing/Standing";
import NavbarFix from "@/components/landing/NavbarFix";

export const metadata: Metadata = {
  title: "Standings",
  description:
    "League standings and tables for Eagles FC youth soccer teams in Grand Island, Nebraska.",
};


const Teams = () => {
    return (


        <div>
            <NavbarFix />
            <Standing />
        </div>
    );

};

export default Teams;
