'use client';

import { usePosts } from '../hooks/usePosts';
import { PostFeed } from './PostFeed';

export function PostsList() {
  const { posts, isPending, error } = usePosts();

  return <PostFeed posts={posts} isPending={isPending} error={error} />;
}
