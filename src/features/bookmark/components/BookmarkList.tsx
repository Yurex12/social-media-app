'use client';
import { PostProvider } from '@/features/post/PostProvider';
import { useBookmarks } from '../hooks/useBookmarks';
import { Spinner } from '@/components/ui/spinner';
import { PostCard } from '@/features/post/components/PostCard';

export function BookmarkList() {
  const { bookmarks, error, isPending } = useBookmarks();

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!bookmarks?.length) return <p>No bookmarks yet</p>;

  console.log(bookmarks);

  return (
    <ul className='space-y-2 sm:space-y-4'>
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <PostProvider post={bookmark}>
            <PostCard />
          </PostProvider>
        </li>
      ))}
    </ul>
  );
}
