import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';

import { RightSidebar } from '@/components/RightSidebar';
import { MarkAllAsReadBtn } from '@/features/notification/components/MarkAllAsReadBtn';
import NotificationList from '@/features/notification/components/NotificationList';

export default function Page() {
  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr] h-full'>
      <div className='border-r'>
        <Header className='justify-between gap-2'>
          <div className='flex items-center gap-6 sm:gap-10'>
            <BackButton />
            <h3 className='text-lg font-semibold'>Notifications</h3>
          </div>

          <MarkAllAsReadBtn />
        </Header>

        <div className='w-full max-w-140 mx-auto'>
          <NotificationList />
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
