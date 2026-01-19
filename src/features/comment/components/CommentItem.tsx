import { Heart } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNowStrict } from 'date-fns';
import { CommentWithRelations } from '../types';
import { useToggleCommentLike } from '../hooks/useToggleCommentLike';

export function CommentItem({ comment }: { comment: CommentWithRelations }) {
  // Helper to get '5m' or '2h'
  const shortTime = formatDistanceToNowStrict(new Date(comment.createdAt))
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' seconds', 's')
    .replace(' second', 's');

  const { toggleCommentLike } = useToggleCommentLike();

  return (
    <div className='flex gap-3 py-2 border-b border-border/50 last:border-0'>
      {/* Avatar */}
      <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted'>
        <Image
          src={comment.user.image || '/avatar-placeholder.png'}
          alt={comment.user.name || 'User'}
          fill
          className='object-cover'
          referrerPolicy='no-referrer'
        />
      </div>

      <div className='flex flex-col gap-1 w-full min-w-0'>
        {/* Header: Name, Username, and Time */}
        <div className='flex items-center gap-1.5 w-full min-w-0'>
          <div className='flex items-center gap-1 min-w-0'>
            <span className='font-semibold text-sm hover:underline cursor-pointer truncate'>
              {comment.user.name}
            </span>
            <span className='text-xs text-muted-foreground truncate'>
              @{comment.user.username}
            </span>
          </div>

          <span className='text-xs text-muted-foreground shrink-0'>•</span>

          <span className='text-xs text-muted-foreground shrink-0'>
            {shortTime}
          </span>
        </div>

        {/* Content */}
        <p className='text-sm text-foreground leading-relaxed wrap-break-words'>
          {comment.content}
        </p>

        {/* Interaction: Like Button aligned to the right */}
        <div className='flex justify-end mt-1'>
          <button
            className='flex items-center gap-1 group'
            onClick={() => toggleCommentLike(comment.id)}
          >
            <div className='p-1.5 rounded-full group-hover:bg-rose-500/10 transition-colors'>
              <Heart
                className={`size-4 transition-colors ${
                  comment.isLiked
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-muted-foreground'
                }`}
              />
            </div>
            <span
              className={`text-xs tabular-nums ${
                comment.isLiked ? 'text-rose-500' : 'text-muted-foreground'
              }`}
            >
              {comment.likesCount > 0 ? comment.likesCount : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
