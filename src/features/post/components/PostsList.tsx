'use client';

import { usePosts } from '../hooks/usePosts';
import { PostFeed } from './PostFeed';

export function PostsList() {
  const { postIds, isPending, error } = usePosts();

  return <PostFeed postIds={postIds} isPending={isPending} error={error} />;
}
