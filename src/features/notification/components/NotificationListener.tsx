'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

import { pusherClient } from '@/lib/pusher';

import { useEntityStore } from '@/entities/store';
import { UserAvatar } from '@/features/profile/components/UserAvatar';

import { NotificationType } from '@/generated/prisma/enums';
import { CommentResponse } from '@/features/comment/types';
import { NotificationData } from '../types';

export function NotificationListener() {
  const session = useSession();
  const userId = session.data?.user?.id;

  const queryClient = useQueryClient();

  const incrementPostCount = useEntityStore(
    (state) => state.incrementPostCount,
  );

  const incrementUserCount = useEntityStore(
    (state) => state.incrementUserCount,
  );

  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind('new-notification', async (data: NotificationData) => {
      await queryClient.cancelQueries({
        queryKey: ['notifications', 'unread-count'],
      });

      queryClient.setQueryData<number>(
        ['notifications', 'unread-count'],
        (old) => (old ?? 0) + 1,
      );

      queryClient.invalidateQueries({
        queryKey: ['notifications'],
        refetchType: 'active',
      });

      if (data.type === 'FOLLOW') incrementUserCount(userId, 'followersCount');

      if (data.type === 'LIKE_POST' && data.postId)
        incrementPostCount(data.postId, 'likesCount');

      if (data.type === 'COMMENT_POST' && data.postId)
        incrementPostCount(data.postId, 'commentsCount');

      if (data.type === 'LIKE_COMMENT' && data.commentId && data.postId) {
        queryClient.setQueryData<InfiniteData<CommentResponse>>(
          ['comments', data.postId],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                comments: page.comments.map((comment) =>
                  comment.id === data.commentId
                    ? { ...comment, likesCount: comment.likesCount + 1 }
                    : comment,
                ),
              })),
            };
          },
        );
      }

      const config: Record<
        NotificationType,
        { icon: React.ReactNode; text: string; color: string }
      > = {
        LIKE_POST: {
          icon: <Heart className='size-3 fill-white text-white' />,
          text: 'liked your post',
          color: 'bg-rose-500',
        },
        LIKE_COMMENT: {
          icon: <Heart className='size-3 fill-white text-white' />,
          text: 'liked your comment',
          color: 'bg-rose-500',
        },
        COMMENT_POST: {
          icon: <MessageCircle className='size-3 text-white' />,
          text: 'commented on your post',
          color: 'bg-blue-500',
        },
        FOLLOW: {
          icon: <UserPlus className='size-3 text-white' />,
          text: 'followed you',
          color: 'bg-purple-500',
        },
      };

      const { icon, text, color } = config[data.type];

      toast.custom(() => (
        <div className='flex items-center gap-3 bg-background border border-border p-3 rounded-xl shadow-lg w-[320px]'>
          <div className='relative shrink-0'>
            <UserAvatar
              image={data.image}
              name={data.name}
              className='border shadow-sm'
            />
            <div
              className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-background ${color}`}
            >
              {icon}
            </div>
          </div>

          <div className='flex flex-col overflow-hidden'>
            <span className='text-sm font-semibold truncate leading-none mb-1'>
              {data.name}
            </span>
            <span className='text-xs text-muted-foreground leading-tight'>
              {text}
            </span>
          </div>
        </div>
      ));
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId, queryClient, incrementUserCount, incrementPostCount]);

  return null;
}
