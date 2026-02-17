'use client';
import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { DiscoveredUsers } from './DiscoveredUsers';
import { RightSidebar } from '@/components/RightSidebar';

export function DiscoverPage() {
  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr]'>
      <div className='border-r'>
        <Header>
          <BackButton />
          <h3 className='text-lg font-semibold'>Follow</h3>
        </Header>

        <DiscoveredUsers />
      </div>

      <RightSidebar />
    </div>
  );
}
