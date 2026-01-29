'use client';
import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { DiscoveredUsers } from './DiscoveredUsers';
import { RightSidebar } from '@/components/RightSidebar';

export function DiscoverPage() {
  return (
    <div className='grid grid-cols-[1.2fr_0.8fr]'>
      <div className='border-r'>
        <Header className='gap-2'>
          <BackButton />
          <h3 className='text-lg font-semibold'>Follow</h3>
        </Header>

        <DiscoveredUsers />
      </div>

      <RightSidebar />
    </div>
  );
}
