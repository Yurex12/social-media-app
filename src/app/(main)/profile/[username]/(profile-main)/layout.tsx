import { ReactNode } from 'react';

import { RightSidebar } from '@/components/RightSidebar';

import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { ProfileNav } from '@/features/profile/components/ProfileNav';

export default function ProfileMainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr]'>
      <div className='border-r'>
        <ProfileHeader />
        <ProfileHero />
        <ProfileNav />
        <section className='sm:px-4 sm:mt-2'>{children}</section>
      </div>

      <RightSidebar />
    </div>
  );
}
