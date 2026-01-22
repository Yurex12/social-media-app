import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { Heart } from 'lucide-react';
import { formatDate } from '../helper';
import { useToggleCommentLike } from '../hooks/useToggleCommentLike';
import { CommentWithRelations } from '../types';

export function CommentItem({ comment }: { comment: CommentWithRelations }) {
  const shortTime = formatDate(comment.createdAt);

  const { toggleCommentLike } = useToggleCommentLike();

  return (
    <div className='flex gap-3 py-2 border-b border-border/50 last:border-0'>
      <UserAvatar image={comment.user.image} name={comment.user.name} />

      <div className='flex flex-col gap-1 w-full min-w-0'>
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

        <p className='text-sm text-foreground leading-relaxed wrap-break-words'>
          {comment.content}
        </p>

        <div className='flex justify-end mt-1'>
          <button
            className='flex items-center gap-1 group'
            onClick={() =>
              toggleCommentLike({
                commentId: comment.id,
                postId: comment.postId,
              })
            }
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
              {comment.likeCount > 0 ? comment.likeCount : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
