import NewsletterBanner from '@/components/landing/NewsLetterBanner';
import TeamClasses from "@/components/landing/TeamClasses";
import Link from 'next/link';
import { getActiveTeams } from '@/actions/team';
import Image from 'next/image';

export default async function Teams() {
  // Fetch active teams from the database
  const teams = await getActiveTeams();

  return (
    <div className="max-w-full overflow-hidden" style={{ marginTop: '70px' }}>
      <NewsletterBanner />

      <TeamClasses teams={teams} />
    </div>
  );
}
