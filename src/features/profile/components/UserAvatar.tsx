'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  isPending?: boolean;
  className?: string;
}

export function UserAvatar({
  name,
  image,
  isPending,
  className,
}: UserAvatarProps) {
  if (isPending) {
    return (
      <Skeleton className={cn('h-10 w-10 rounded-full bg-muted', className)} />
    );
  }

  const initial = name?.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-primary/80 text-background',
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={name || 'User'}
          fill
          sizes='(max-width: 768px) 40px, 40px'
          className='object-cover'
          referrerPolicy='no-referrer'
        />
      ) : (
        <span className='text-lg select-none uppercase'>
          {initial || <User className='h-5 w-5' />}
        </span>
      )}
    </div>
  );
}
