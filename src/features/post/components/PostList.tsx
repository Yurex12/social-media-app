'use client';

import { usePosts } from '../hooks/usePosts';
import { PostFeed } from './PostFeed';

export function PostList() {
  const queryState = usePosts();

  return <PostFeed {...queryState} emptyMessage='No posts yet!.' />;
}
