'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useBookmarks } from '../hooks/useBookmarks';

export function BookmarkList() {
  const { bookmarkIds, error, isPending } = useBookmarks();

  return (
    <PostFeed
      postIds={bookmarkIds}
      isPending={isPending}
      error={error}
      emptyMessage="You haven't bookmarked anything yet."
    />
  );
}
