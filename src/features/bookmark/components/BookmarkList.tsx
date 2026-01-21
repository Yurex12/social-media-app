'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useBookmarks } from '../hooks/useBookmarks';

export function BookmarkList() {
  const { bookmarks, error, isPending } = useBookmarks();

  return (
    <PostFeed
      posts={bookmarks}
      isPending={isPending}
      error={error}
      emptyMessage="You haven't bookmarked anything yet."
    />
  );
}
