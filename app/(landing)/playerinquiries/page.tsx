import RegistrationForm from "@/components/landing/RegistrationForm";

export const metadata = {
  title: 'Player Registration',
  description:
    'Register your child for Eagles FC youth soccer in Grand Island, Nebraska. Sign up for tryouts and join the best kids soccer program in central Nebraska.',
  openGraph: {
    title: 'Player Registration | Eagles FC - Grand Island, NE',
    description:
      'Register your child for Eagles FC youth soccer in Grand Island, Nebraska.',
  },
};

const PlayerRegistration = () => {
  return (
    <div className="bg-white">
      <RegistrationForm />
    </div>
  );
};

export default PlayerRegistration;
  