'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useSearchPosts } from '../hooks/useSearchPosts';

export function PostsSearchResults({ query }: { query: string }) {
  const queryState = useSearchPosts(query);
  return (
    <PostFeed
      {...queryState}
      emptyMessage={
        <p>
          No result match{' '}
          <span className='font-semibold text-foreground/80'>
            &quot;{query}&quot;
          </span>
        </p>
      }
    />
  );
}
