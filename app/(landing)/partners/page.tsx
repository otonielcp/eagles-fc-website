
import PartnerHero from '@/components/landing/PartnerHero';
import MainPartners from '@/components/landing/MainPartners';
import PremierPartners from '@/components/landing/PremierPartners';
import PartnershipForm from '@/components/landing/PartnershipForm';
import PartnershipBenefits from '@/components/landing/PartnershipBenefits';

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
  