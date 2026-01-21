'use client';

import { Spinner } from '@/components/ui/spinner';
import { CommentInputBar } from '@/features/comment/components/CommentInputBar';
import { CommentList } from '@/features/comment/components/CommentList';
import { useParams } from 'next/navigation';
import { usePostDetail } from '../hooks/usePostDetails';
import { PostProvider } from '../PostProvider';
import { PostCard } from './PostCard';

export function PostDetails() {
  const { id } = useParams();
  const { post, isPending, error } = usePostDetail(id as string);

  if (isPending) return <Spinner />;

  if (error) return <p>{error.message}</p>;

  if (!post) return <p className='px-4'>No post found - nothing to see here</p>;

  return (
    <PostProvider post={post}>
      <div className='space-y-4 px-4'>
        <PostCard />
        <CommentInputBar />
        <CommentList />
      </div>
    </PostProvider>
  );
}
