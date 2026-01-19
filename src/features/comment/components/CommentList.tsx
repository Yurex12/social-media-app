import { Spinner } from '@/components/ui/spinner';
import { useComments } from '../hooks/useComments';
import { CommentItem } from './CommentItem';
import { usePost } from '@/features/post/PostProvider';

export function CommentList() {
  const { post } = usePost();
  const { comments, error, isPending } = useComments(post.id);

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!comments?.length) return <p>No comments yet</p>;

  console.log(comments);

  return (
    <div className='w-full max-w-140 mx-auto space-y-2'>
      <h3 className='font-semibold text-lg'>Comments</h3>
      <div className='flex flex-col'>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
