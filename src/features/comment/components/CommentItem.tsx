import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { UserAvatar } from '@/features/profile/components/UserAvatar';

import { formatDate } from '@/lib/helpers';
import { useConfirmDialogStore } from '@/store/useConfirmDialogStore';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useToggleCommentLike } from '../hooks/useToggleCommentLike';
import { CommentWithRelations } from '../types';

export function CommentItem({ comment }: { comment: CommentWithRelations }) {
  const { toggleCommentLike } = useToggleCommentLike();
  const { deleteComment } = useDeleteComment();

  const { openConfirm } = useConfirmDialogStore();

  const shortTime = formatDate(comment.createdAt);

  const profileUrl = `/profile/${comment.user.username}`;

  return (
    <div
      className='flex gap-3 py-2 border-b border-border/50 last:border-0'
      id={comment.id}
    >
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

        <div className='flex justify-end items-center gap-1 mt-1'>
          <div className='flex items-center w-10'>
            {' '}
            {/* Adjust width as needed to fit max expected digits */}
            <button
              className='flex items-center group relative'
              onClick={(e) => {
                e.stopPropagation();
                toggleCommentLike({
                  commentId: comment.id,
                  postId: comment.postId,
                });
              }}
            >
              <div className='p-1.5 rounded-full group-hover:bg-rose-500/10 transition-colors flex items-center justify-center'>
                <Heart
                  className={`size-4 transition-colors ${
                    comment.isLiked
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-muted-foreground group-hover:text-rose-500'
                  }`}
                />
              </div>

              {/* Absolute positioning or reserved space ensures the Heart NEVER moves */}
              <span
                className={`text-xs tabular-nums absolute left-8 ${
                  comment.isLiked ? 'text-rose-500' : 'text-muted-foreground'
                }`}
              >
                {comment.likesCount > 0 ? comment.likesCount : ''}
              </span>
            </button>
          </div>

          <div className='w-8 flex justify-center'>
            {comment.user.isCurrentUser && (
              <button
                className='p-1.5 rounded-full text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors'
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirm({
                    resourceName: 'comment',
                    onConfirm: () =>
                      deleteComment({
                        commentId: comment.id,
                        postId: comment.postId,
                      }),
                  });
                }}
              >
                <Trash2 className='size-4' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
