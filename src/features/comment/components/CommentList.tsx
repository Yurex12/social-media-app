import { Spinner } from '@/components/ui/spinner';
import { useComments } from '../hooks/useComments';
import { CommentItem } from './CommentItem';
import { usePost } from '@/features/post/PostProvider';

export function CommentList() {
  const { post } = usePost();
  const { commentIds, error, isPending } = useComments(post.id);

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!commentIds?.length) return null;

  return (
    <div className='w-full max-w-140 mx-auto space-y-2'>
      <h3 className='font-semibold text-lg'>Comments</h3>
      <div className='flex flex-col'>
        {commentIds.map((commentId) => (
          <CommentItem key={commentId} commentId={commentId} />
        ))}
      </div>
    </div>
  );
}
