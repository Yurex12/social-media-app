import { Heart } from 'lucide-react';
import Link from 'next/link';

import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { useToggleCommentLike } from '../hooks/useToggleCommentLike';
import { formatDate } from '../helper';
import { CommentWithRelations } from '../types';

export function CommentItem({ comment }: { comment: CommentWithRelations }) {
  const shortTime = formatDate(comment.createdAt);

  const { toggleCommentLike } = useToggleCommentLike();

  const profileUrl = `/profile/${comment.user.username}`;

  return (
    <div className='flex gap-3 py-2 border-b border-border/50 last:border-0'>
      <Link href={profileUrl}>
        <UserAvatar image={comment.user.image} name={comment.user.name} />
      </Link>

      <div className='flex flex-col gap-1 w-full min-w-0'>
        <div className='flex items-center gap-1.5 w-full min-w-0'>
          <Link
            href={profileUrl}
            className='flex items-center gap-1 min-w-0 group/name'
          >
            <span className='font-semibold text-sm text-foreground/80 group-hover/name:underline truncate'>
              {comment.user.name}
            </span>
            <span className='text-xs text-muted-foreground truncate'>
              @{comment.user.username}
            </span>
          </Link>

          <span className='text-xs text-muted-foreground shrink-0'>•</span>

          <span className='text-xs text-muted-foreground shrink-0'>
            {shortTime}
          </span>
        </div>

        <p className='text-sm leading-relaxed wrap-break-words'>
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
