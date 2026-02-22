import { ReactNode } from 'react';

import { getRequiredSession } from '@/lib/session';

import { RightSidebar } from '@/components/RightSidebar';
import { MobileCreatePostButton } from '@/features/post/components/MobileCreatePostButton';
import { WhoToFollow } from '@/features/profile/components/WhoToFollow';

export default async function MainLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  await getRequiredSession();

  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr]'>
      {children}
      <RightSidebar>
        <WhoToFollow />
      </RightSidebar>

      <MobileCreatePostButton />
    </div>
  );
}
