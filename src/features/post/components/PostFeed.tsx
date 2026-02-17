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
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '400px' });

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
      <div className='flex justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error && !postIds?.length)
    return (
      <p className='mt-4 text-center text-muted-foreground'>{error.message}</p>
    );

  if (!postIds?.length)
    return (
      <div className='mt-4 text-center text-muted-foreground'>
        {emptyMessage}
      </div>
    );

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

      {(hasNextPage || isFetchingNextPage || isFetchNextPageError) && (
        <div
          ref={ref}
          className='py-12 flex flex-col items-center justify-center border-t border-border/50'
        >
          {isFetchingNextPage && <Spinner className='size-6 text-primary' />}

          {isFetchNextPageError && (
            <button
              onClick={() => fetchNextPage()}
              className='text-sm text-primary hover:underline font-medium'
            >
              Retry loading posts
            </button>
          )}
        </div>
      )}
    </div>
  );
}
