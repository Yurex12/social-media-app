'use client';

import { Spinner } from '@/components/ui/spinner';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';
import { PostProvider } from '../PostProvider';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { BackButton } from '@/components/BackButton';

export default function PostsList() {
  const { posts, isPending, error } = usePosts();

  const router = useRouter();
  const queryClient = useQueryClient();

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!posts?.length) return <p>No posts yet</p>;

  console.log(posts);

  return (
    <ul className='space-y-2 sm:space-y-4'>
      <Button
        onClick={async () => {
          await signOut({
            fetchOptions: {
              onSuccess() {
                router.replace('/login');
                queryClient.clear();
              },
            },
          });
        }}
      >
        Logout
      </Button>

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
