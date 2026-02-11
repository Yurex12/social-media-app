import { Spinner } from '@/components/ui/spinner';
import { usePost } from '@/features/post/PostProvider';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useComments } from '../hooks/useComments';
import { CommentItem } from './CommentItem';

export function CommentList() {
  const { post } = usePost();
  const {
    comments,
    error,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  } = useComments(post.id);

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '400px' });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending)
    return (
      <div className='flex items-center justify-center p-8'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error && !comments?.length)
    return <p className='text-center text-destructive p-4'>{error.message}</p>;

  if (!comments?.length) return null;

  return (
    <div className='w-full max-w-140 mx-auto space-y-4'>
      <h3 className='font-semibold text-lg px-1'>Comments</h3>

      <div className='flex flex-col'>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {(hasNextPage || isFetchingNextPage || isFetchNextPageError) && (
        <div
          ref={ref}
          className='py-8 flex flex-col items-center justify-center border-t border-border/50'
        >
          {isFetchingNextPage && <Spinner className='size-6 text-primary' />}

          {isFetchNextPageError && (
            <button
              onClick={() => fetchNextPage()}
              className='text-sm text-primary hover:underline font-medium'
            >
              Retry loading comments
            </button>
          )}
        </div>
      )}
    </div>
  );
}
