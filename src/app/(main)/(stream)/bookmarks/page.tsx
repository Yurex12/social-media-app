import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';

import { BookmarkList } from '@/features/bookmark/components/BookmarkList';

export default function Page() {
  return (
    <div className='sm:space-y-4 w-full'>
      <Header>
        <BackButton />
        <h3 className='text-lg font-semibold'>Bookmarks</h3>
      </Header>

      <div className='flex items-center justify-center flex-col gap-4 sm:px-4 w-full'>
        <BookmarkList />
      </div>
    </div>
  );
}
