'use client';

import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'next/navigation';
import { usePostDetail } from '../hooks/usePostDetails';
import { PostProvider } from '../PostProvider';
import { PostCard } from './PostCard';
import { CommentList } from '@/features/comment/components/CommentList';
import { CommentInputBar } from '@/features/comment/components/CommentInputBar';
import { Header } from '@/components/Header';

export function PostDetails() {
  const { id } = useParams();
  const { post, isPending, error } = usePostDetail(id as string);

  if (isPending) return <Spinner />;

  if (error) return <p>{error.message}</p>;

  if (!post) return <p>No post found</p>;

  return (
    <div className='flex flex-col h-full pb-2'>
      <Header />
      <PostProvider post={post}>
        <div className='flex-1 overflow-y-scroll py-4 space-y-2'>
          <PostCard />
          <CommentList />
        </div>
        <CommentInputBar />
      </PostProvider>
    </div>
  );
}
