'use client';

import { useSession } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const { data, isPending } = useSession();

  if (isPending) {
    return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />;
  }

  const user = data?.user;
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn('h-10 w-10 border', className)}>
      <AvatarImage
        src={user?.image || undefined}
        alt={user?.name || 'User Avatar'}
        className='object-cover'
      />

      <AvatarFallback className='bg-muted font-medium text-muted-foreground'>
        {initials || <User className='h-5 w-5 opacity-60' />}
      </AvatarFallback>
    </Avatar>
  );
}
