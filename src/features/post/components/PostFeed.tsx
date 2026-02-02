'use client';

import { Spinner } from '@/components/ui/spinner';
import { PostProvider } from '@/features/post/PostProvider';
import { PostCard } from '@/features/post/components/PostCard';

import { ReactElement } from 'react';

interface PostFeedProps {
  postIds: string[] | undefined;
  isPending: boolean;
  error: Error | null;
  emptyMessage?: ReactElement | string;
}

export function PostFeed({
  postIds,
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

  if (!postIds?.length)
    if (typeof emptyMessage === 'string') {
      return <p className='mt-4 text-muted-foreground'>{emptyMessage}</p>;
    } else return emptyMessage;

  return (
    <ul className='pb-4'>
      {postIds.map((postId) => (
        <li key={postId} className='mt-4 '>
          <PostProvider postId={postId}>
            <PostCard />
          </PostProvider>
        </li>
      ))}
    </ul>
  );
}
