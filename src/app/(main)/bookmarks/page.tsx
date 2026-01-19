import { Header } from '@/components/Header';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';

export default function Page() {
  return (
    <div className='flex flex-col h-full space-y-4'>
      <Header />
      <BookmarkList />;
    </div>
  );
}
