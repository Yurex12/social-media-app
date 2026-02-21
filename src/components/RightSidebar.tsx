import { ReactNode } from 'react';
import { Header } from './Header';
import { WhoToFollow } from '@/features/profile/components/WhoToFollow';
import { ModeToggle } from './ModeToggle';

export function RightSidebar({ children }: { children?: ReactNode }) {
  return (
    <aside className='hidden xl:block space-y-4 h-dvh border-l border-border sticky top-0'>
      <Header className='justify-end'>
        <ModeToggle />
      </Header>

      <div className='px-4 h-fit sticky top-20'>
        {children || <WhoToFollow />}
      </div>
    </aside>
  );
}
