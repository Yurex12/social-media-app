import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';

export default function Page() {
  return (
    <div className='grid grid-cols-[1.2fr_0.8fr] h-full'>
      <div className='border-r space-y-4'>
        <Header>
          <BackButton />
          <h3 className='text-lg font-semibold'>Bookmarks</h3>
        </Header>

        <div className='px-4'>
          <BookmarkList />
        </div>
      </div>
    </div>
  );
}
