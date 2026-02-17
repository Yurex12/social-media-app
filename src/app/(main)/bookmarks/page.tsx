import { Header } from '@/components/Header';
import { BackButton } from '@/components/BackButton';

import { BookmarkList } from '@/features/bookmark/components/BookmarkList';
import { RightSidebar } from '@/components/RightSidebar';

export default function Page() {
  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr] h-full'>
      <div className='border-r sm:space-y-4 w-full'>
        <Header>
          <BackButton />
          <h3 className='text-lg font-semibold'>Bookmarks</h3>
        </Header>

        <div className='flex items-center justify-center flex-col gap-4 sm:px-4 w-full'>
          <BookmarkList />
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
