'use client';

import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { NotificationType } from '@/generated/prisma/enums';
import { useSession } from '@/lib/auth-client';
import { pusherClient } from '@/lib/pusher';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Data = {
  type: NotificationType;
  commentId?: string;
  issuerId: string;
  postId?: string;
  name: string;
  image: string;
};

export function NotificationListener() {
  const session = useSession();
  const userId = session.data?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind('new-notification', (data: Data) => {
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

      toast.custom((t) => (
        <div className='flex items-center gap-3 bg-background border border-border p-3 rounded-xl shadow-lg w-[320px]'>
          {/* Avatar Container */}
          <div className='relative shrink-0'>
            <UserAvatar
              image={data.image}
              name={data.name}
              className='size-10 border shadow-sm'
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
  }, [userId]);

  return null;
}
