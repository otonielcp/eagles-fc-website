import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

export const metadata = {
  title: 'Contact Us',
  description:
    'Contact Eagles Football Club in Grand Island, Nebraska. Reach out for registration info, team inquiries, partnerships, or general questions about our youth soccer programs.',
  openGraph: {
    title: 'Contact Us | Eagles FC - Grand Island, NE',
    description:
      'Contact Eagles Football Club in Grand Island, Nebraska for registration, team inquiries, and more.',
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
    </div>
  );
}
