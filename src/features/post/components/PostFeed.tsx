'use client';

import { Spinner } from '@/components/ui/spinner';
import { PostProvider } from '@/features/post/PostProvider';
import { PostCard } from '@/features/post/components/PostCard';
import { PostFeedProps } from '@/features/post/types';

export function PostFeed({
  posts,
  isPending,
  error,
  emptyMessage = 'No posts found',
}: PostFeedProps) {
  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error) return <p className='mt-4'>{error.message}</p>;

  if (!posts?.length) {
    if (typeof emptyMessage === 'string') {
      return <p className='mt-4 text-muted-foreground'>{emptyMessage}</p>;
    } else return emptyMessage;
  }

  return (
    <ul className='pb-4'>
      {posts.map((post) => (
        <li key={post.id} className='mt-4 '>
          <PostProvider post={post}>
            <PostCard />
          </PostProvider>
        </li>
      ))}
    </ul>
  );
}
