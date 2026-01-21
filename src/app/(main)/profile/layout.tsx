import { Header } from '@/components/Header';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileTabs } from '@/features/profile/components/ProfileTab';
import React, { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col h-full pb-2'>
      <Header />
      <ProfileHeader />
      <ProfileTabs username='ekungomiyusuf' />

      <main>{children}</main>
    </div>
  );
}
