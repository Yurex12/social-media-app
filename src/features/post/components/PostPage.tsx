'use client';
import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { RightSidebar } from '@/components/RightSidebar';

import { PostDetails } from '@/features/post/components/PostDetails';
import { AuthorCard } from '@/features/profile/components/AuthorCard';
import { usePostDetails } from '../hooks/usePostDetails';
import { useParams } from 'next/navigation';

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { postId, isPending, error } = usePostDetails(id);

  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr] h-full'>
      <div className='border-r'>
        <Header>
          <BackButton />
          <h3 className='text-lg font-semibold'>Post</h3>
        </Header>

        <PostDetails postId={postId} isPending={isPending} error={error} />
      </div>

      <RightSidebar>
        <AuthorCard postId={postId} isPending={isPending} error={error} />
      </RightSidebar>
    </div>
  );
}
