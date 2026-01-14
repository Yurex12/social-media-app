'use client';

import { Spinner } from '@/components/ui/spinner';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';
import { PostProvider } from '../PostProvider';

export default function PostsList() {
  const { posts, isPending, error } = usePosts();

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!posts?.length) return <p>No posts yet</p>;

  return (
    <ul className='space-y-2 sm:space-y-4'>
      {posts.map((post) => (
        <li key={post.id}>
          <PostProvider post={post}>
            <PostCard />
          </PostProvider>
        </li>
      ))}
    </ul>
  );
}
