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
  textClassName?: string;
}

export function UserAvatar({
  name,
  image,
  isPending,
  className,
  textClassName,
}: UserAvatarProps) {
  if (isPending) {
    return <Skeleton className='size-10 rounded-full bg-muted' />;
  }

  const initial = name?.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'relative flex size-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-primary/80 text-background',
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={name || 'User'}
          fill
          className='object-cover'
          referrerPolicy='no-referrer'
          loading='eager'
        />
      ) : (
        <span
          className={cn(
            'text-lg select-none uppercase text-white',
            textClassName,
          )}
        >
          {initial || <User className='h-5 w-5' />}
        </span>
      )}
    </div>
  );
}
