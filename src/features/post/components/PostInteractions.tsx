import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePost } from '../PostProvider';
import { useToggleLike } from '../hooks/useToggleLike';

export function PostInteractions() {
  const { post, user } = usePost();
  const { toggleLike } = useToggleLike();

  const postTimeStamp = formatDistanceToNowStrict(new Date(post.createdAt), {
    addSuffix: true,
  });

  const router = useRouter();

  return (
    <div className='border-t border-border/40 px-2 sm:px-4 pt-2 flex justify-between items-center'>
      <div className='flex items-center gap-4'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(post.id);
          }}
          className={cn(
            'group flex items-center gap-1 transition-colors hover:cursor-pointer',
            post.isLiked
              ? 'text-red-500'
              : 'text-muted-foreground hover:text-red-500',
          )}
        >
          <div
            className={cn(
              'rounded-full p-2 transition-colors',
              post.isLiked ? 'bg-red-500/10' : 'group-hover:bg-red-500/10',
            )}
          >
            <Heart
              className={cn(
                'h-4.5 w-4.5 transition-all',
                post.isLiked && 'fill-current',
              )}
              strokeWidth={2}
            />
          </div>
          <span className='text-xs font-medium tabular-nums'>
            {post.likesCount}
          </span>
        </button>

        {/* Comment Button */}

        <button
          className='group flex items-center gap-1 text-muted-foreground transition-colors hover:text-sky-500 hover:cursor-pointer'
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${user.username!}/status/${post.id}`);
          }}
        >
          <div className='rounded-full p-2 group-hover:bg-sky-500/10 transition-colors'>
            <MessageSquare className='h-4.5 w-4.5' strokeWidth={2} />
          </div>
          <span className='text-xs font-medium tabular-nums'>
            {post.commentsCount}
          </span>
        </button>
      </div>

      {/* Right: Timestamp */}
      <div className='pr-2'>
        <span className='text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground/60'>
          {postTimeStamp}
        </span>
      </div>
    </div>
  );
}
