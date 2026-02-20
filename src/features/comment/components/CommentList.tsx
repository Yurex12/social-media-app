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

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '1000px' });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetchNextPageError,
  ]);

  if (isPending)
    return (
      <div className='flex items-center justify-center p-8'>
        <Spinner className='size-6' />
      </div>
    );

  if (error && !comments?.length)
    return <p className='text-center p-4'>{error.message}</p>;

  if (!comments?.length) return null;

  return (
    <div className='w-full max-w-140 mx-auto space-y-4'>
      <h3 className='font-semibold text-lg px-1'>Comments</h3>

      <div className='flex flex-col'>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={ref} className='h-1 w-full' aria-hidden='true' />
      )}

      <div className='flex flex-col items-center justify-center mb-20 sm:mb-0'>
        {isFetchingNextPage && <Spinner className='size-6' />}

        {isFetchNextPageError && !isFetchingNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className='text-sm text-primary font-medium px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors'
          >
            Tap to retry
          </button>
        )}

        {!hasNextPage && (
          <p className='text-sm text-muted-foreground'>No more comments.</p>
        )}
      </div>
    </div>
  );
}
