'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useSearchPosts } from '../hooks/useSearchPosts';

export function PostsSearchResults({ query }: { query: string }) {
  const { postIds, isPending, error } = useSearchPosts(query);
  return (
    <PostFeed
      postIds={postIds}
      isPending={isPending}
      error={error}
      emptyMessage={
        <p className='mt-4'>
          No result match{' '}
          <span className='font-semibold text-foreground/80'>
            &quot;{query}&quot;
          </span>
        </p>
      }
    />
  );
}
