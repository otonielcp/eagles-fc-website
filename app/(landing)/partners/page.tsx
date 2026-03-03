import type { Metadata } from "next";
import PartnerHero from '@/components/landing/PartnerHero';
import MainPartners from '@/components/landing/MainPartners';
import PremierPartners from '@/components/landing/PremierPartners';
import PartnershipForm from '@/components/landing/PartnershipForm';
import PartnershipBenefits from '@/components/landing/PartnershipBenefits';

export const metadata: Metadata = {
  title: "Partners & Sponsors",
  description:
    "Eagles FC partners and sponsors in Grand Island, Nebraska. Learn about partnership opportunities and support youth soccer in central Nebraska.",
  openGraph: {
    title: "Partners & Sponsors | Eagles FC - Grand Island, NE",
    description:
      "Eagles FC partners and sponsors. Learn about partnership opportunities and support youth soccer in central Nebraska.",
  },
};

const Partners = () => {
  return (
    <div className="max-w-full overflow-hidden">
      <PartnerHero />
      <PartnershipBenefits />
      <MainPartners />
      <PremierPartners />
      <PartnershipForm />
    </div>
  );
}

export default Partners;
  