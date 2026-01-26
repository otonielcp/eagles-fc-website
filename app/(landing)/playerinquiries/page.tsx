import RegistrationForm from "@/components/landing/RegistrationForm";

export const metadata = {
  title: 'Player Registration | Eagles Football Club',
  description: 'Register your interest in joining Eagles FC',
};

const PlayerRegistration = () => {
  return (
    <div className="bg-white">
      <RegistrationForm />
    </div>
  );
};

export default PlayerRegistration;
  