import { RightSidebar } from '@/components/RightSidebar';
import { ProfileRelationsHeader } from '@/features/profile/components/ProfileRelationsHeader';
import { ProfileRelationsNav } from '@/features/profile/components/ProfileRelationsNav';
import { ReactNode } from 'react';

export default function ProfileRelationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='grid grid-cols-[1.2fr_0.8fr]'>
      <div className='border-r'>
        <ProfileRelationsHeader />

        <ProfileRelationsNav />
        <section>{children}</section>
      </div>

      <RightSidebar />
    </div>
  );
}
