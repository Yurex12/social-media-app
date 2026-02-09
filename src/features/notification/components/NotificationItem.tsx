import { useEntityStore } from '@/entities/store';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { UserAvatar } from '@/features/profile/components/UserAvatar';

import { selectNotificationById } from '@/entities/notificationSelectors';
import { selectUserById } from '@/entities/userSelectors';
import { formatDate } from '@/lib/helpers';

export function NotificationItem({
  notificationId,
}: {
  notificationId: string;
}) {
  const notification = useEntityStore((state) =>
    selectNotificationById(state, notificationId),
  );
  const issuer = useEntityStore((state) =>
    selectUserById(state, notification?.issuerId),
  );

  if (!notification || !issuer) return null;

  // Configuration based on type
  const config = {
    LIKE_POST: {
      icon: <Heart className='size-4 fill-rose-500 text-rose-500' />,
      text: 'liked your post',
      href: `${issuer.username}/status/${notification.postId}`,
    },
    LIKE_COMMENT: {
      icon: <Heart className='size-4 fill-rose-500 text-rose-500' />,
      text: 'liked your comment',
      href: `${issuer.username}/status/${notification.postId}#${notification.commentId}`,
    },
    COMMENT_POST: {
      icon: <MessageCircle className='size-4 text-blue-500' />,
      text: 'commented on your post',
      href: `${issuer.username}/status/${notification.postId}#${notification.commentId}`,
    },
    FOLLOW: {
      icon: <UserPlus className='size-4 text-purple-500' />,
      text: 'followed you',
      href: `/profile/${issuer.username}`,
    },
  }[notification.type];

  return (
    <Link
      href={config.href}
      className='flex gap-3 p-4 border-b border-border/50 hover:bg-accent/50 transition-colors group'
    >
      <div className='shrink-0 mt-1'>{config.icon}</div>

      <div className='flex flex-col gap-1 w-full min-w-0'>
        <div className='flex items-center gap-2'>
          <UserAvatar
            image={issuer.image}
            name={issuer.name}
            className='size-8'
          />
          <div className='flex flex-wrap gap-x-1 text-sm'>
            <span className='font-bold'>{issuer.name}</span>
            <span className='text-muted-foreground'>{config.text}</span>
          </div>
          <span className='text-xs text-muted-foreground ml-auto'>
            {formatDate(notification.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
