import { UserNavActions } from '@/features/profile/components/UserNavActions';
import { ReactNode } from 'react';
import { Header } from './Header';
import { WhoToFollow } from '@/features/profile/components/WhoToFollow';

export function RightSidebar({ children }: { children?: ReactNode }) {
  return (
    <aside className='hidden xl:block space-y-4'>
      <Header className='justify-end'>
        <UserNavActions />
      </Header>

      <div className='px-4 h-fit sticky top-20'>
        {children || <WhoToFollow />}
      </div>
    </aside>
  );
}
