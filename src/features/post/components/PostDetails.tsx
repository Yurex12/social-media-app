'use client';

import { Spinner } from '@/components/ui/spinner';
import { CommentInputBar } from '@/features/comment/components/CommentInputBar';
import { CommentList } from '@/features/comment/components/CommentList';

import { PostCard } from './PostCard';

import { PostProvider } from '../PostProvider';
interface PostDetailsProps {
  postId: string | undefined;
  isPending: boolean;
  error: Error | null;
}

export function PostDetails({ postId, isPending, error }: PostDetailsProps) {
  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error) return <p className='px-4'>{error.message}</p>;

  if (!postId)
    return <p className='px-4'>No post found - nothing to see here</p>;

  return (
    <PostProvider postId={postId}>
      <div className='space-y-4 px-4'>
        <PostCard />
        <CommentInputBar />
        <CommentList />
      </div>
    </PostProvider>
  );
}
