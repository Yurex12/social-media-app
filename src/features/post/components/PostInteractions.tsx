import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageSquare } from 'lucide-react';
import { usePost } from '../PostProvider';

export function PostInteractions() {
  const { post } = usePost();
  const postTimeStamp = formatDistanceToNowStrict(post.createdAt, {
    addSuffix: true,
  });

  const postLikes = 125;
  const postComments = 42;

  return (
    <div className='border-t border-border/40 px-4 pt-2 flex justify-between items-center'>
      {/* Left: Actions */}
      <div className='flex items-center gap-4'>
        {/* Like */}
        <button className='group flex items-center gap-1 text-muted-foreground transition-colors hover:text-red-500'>
          <div className='rounded-full p-2 group-hover:bg-red-500/10 transition-colors'>
            <Heart className='h-4.5 w-4.5' strokeWidth={2} />
          </div>
          <span className='text-xs font-medium tabular-nums'>
            {postLikes.toLocaleString()}
          </span>
        </button>

        {/* Comment */}
        <button className='group flex items-center gap-1 text-muted-foreground transition-colors hover:text-sky-500'>
          <div className='rounded-full p-2 group-hover:bg-sky-500/10 transition-colors'>
            <MessageSquare className='h-4.5 w-4.5' strokeWidth={2} />
          </div>
          <span className='text-xs font-medium tabular-nums'>
            {postComments.toLocaleString()}
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
