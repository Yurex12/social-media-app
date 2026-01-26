'use client';
import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { RightSidebar } from '@/components/RightSidebar';

import { PostDetails } from '@/features/post/components/PostDetails';
import { AuthorCard } from '@/features/profile/components/AuthorCard';
import { usePostDetails } from '../hooks/usePostDetails';

export function PostPage() {
  const { post, isPending, error } = usePostDetails();

  return (
    <div className='grid grid-cols-[1.2fr_0.8fr] h-full'>
      <div className='border-r space-y-4'>
        <Header>
          <BackButton />
          <h3 className='text-lg font-semibold'>Post</h3>
        </Header>

        <PostDetails post={post} isPending={isPending} error={error} />
      </div>

      <RightSidebar>
        <AuthorCard user={post?.user} isPending={isPending} error={error} />
      </RightSidebar>
    </div>
  );
}
