'use client';

import { Spinner } from '@/components/ui/spinner';
import { PostProvider } from '@/features/post/PostProvider';
import { PostCard } from '@/features/post/components/PostCard';
import { ReactElement, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface PostFeedProps {
  postIds: string[] | undefined;
  isPending: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: VoidFunction;
  isFetchNextPageError?: boolean;
  emptyMessage?: string | ReactElement;
}

export function PostFeed({
  postIds,
  isPending,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isFetchNextPageError,
  emptyMessage = 'No posts found.',
}: PostFeedProps) {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '1000px' });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6' />
      </div>
    );

  if (error && !postIds?.length)
    return <p className='mt-4 text-muted-foreground'>{error.message}</p>;

  if (!postIds?.length)
    return <div className='mt-4 text-muted-foreground'>{emptyMessage}</div>;

  return (
    <div className='w-full'>
      <ul className='pb-4 flex items-center justify-center flex-col sm:space-y-4'>
        {postIds.map((postId) => (
          <li
            key={postId}
            className='sm:border sm:rounded-lg w-full border-b rounded-none max-w-140'
          >
            <PostProvider postId={postId}>
              <PostCard />
            </PostProvider>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref} className='h-1 w-full' aria-hidden='true' />
      )}

      <div className='flex flex-col items-center justify-center mb-20 sm:mb-0'>
        {isFetchingNextPage && <Spinner className='size-6' />}

        {isFetchNextPageError && !isFetchingNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className='text-sm text-primary font-medium px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors'
          >
            Tap to retry
          </button>
        )}

        {!hasNextPage && (
          <p className='text-sm text-muted-foreground'>No more posts.</p>
        )}
      </div>
    </div>
  );
}
