'use client';

import { Spinner } from '@/components/ui/spinner';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';

export default function PostsList() {
  const { posts, isPending, error } = usePosts();

  if (isPending)
    return (
      <div className='mx-auto'>
        <Spinner />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!posts?.length) return <p>No posts yet</p>;

  return (
    <div className='space-y-2 sm:space-y-4'>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
