import { Heart } from 'lucide-react';
import Link from 'next/link';

import { selectCommentById } from '@/entities/commentSelectors';
import { useEntityStore } from '@/entities/store';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { formatDate } from '../helper';
import { useToggleCommentLike } from '../hooks/useToggleCommentLike';
import { selectUserById } from '@/entities/userSelectors';

export function CommentItem({ commentId }: { commentId: string }) {
  const { toggleCommentLike } = useToggleCommentLike();

  const comment = useEntityStore((state) =>
    selectCommentById(state, commentId),
  );
  const user = useEntityStore((state) =>
    selectUserById(state, comment?.userId),
  );

  if (!comment || !user) return null;

  const shortTime = formatDate(comment.createdAt);

  const profileUrl = `/profile/${user.username}`;

  return (
    <div className='flex gap-3 py-2 border-b border-border/50 last:border-0'>
      <Link href={profileUrl}>
        <UserAvatar image={user.image} name={user.name} />
      </Link>

      <div className='flex flex-col gap-1 w-full min-w-0'>
        <div className='flex items-center gap-1.5 w-full min-w-0'>
          <Link
            href={profileUrl}
            className='flex items-center gap-1 min-w-0 group/name'
          >
            <span className='font-semibold text-sm text-foreground/80 group-hover/name:underline truncate'>
              {user.name}
            </span>
            <span className='text-xs text-muted-foreground truncate'>
              @{user.username}
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
            onClick={(e) => {
              e.stopPropagation();
              toggleCommentLike({
                commentId: comment.id,
                postId: comment.postId,
              });
            }}
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
              className={`text-xs tabular-nums inline-block min-w-[1ch] text-right ${
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
