import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';

import { RightSidebar } from '@/components/RightSidebar';
import { MarkAllAsReadBtn } from '@/features/notification/components/MarkAllAsReadBtn';
import NotificationList from '@/features/notification/components/NotificationList';

export default function Page() {
  return (
    <div className='grid grid-cols-[1.2fr_0.8fr] h-full'>
      <div className='border-r'>
        <Header className='justify-between gap-0'>
          <div className='flex items-center gap-10 '>
            <BackButton />
            <h3 className='text-lg font-semibold'>Notifications</h3>
          </div>

          <MarkAllAsReadBtn />
        </Header>

        <div>
          <NotificationList />
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
