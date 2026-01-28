'use client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { AuthorCardProps } from '../types';
import { UserAvatar } from './UserAvatar';

export function AuthorCard({ user, isPending, error }: AuthorCardProps) {
  const { toggleFollow } = useToggleFollow();

  if (isPending)
    return (
      <div className='flex items-center justify-center p-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error || !user) return null;

  return (
    <Link
      href={`/profile/${user.username}`}
      className='block p-4 transition-colors hover:bg-muted/10 group border rounded-md space-y-3'
    >
      <div className='flex gap-3'>
        <div className='shrink-0'>
          <UserAvatar image={user.image} name={user.name} />
        </div>

        <div className='flex flex-1 justify-between items-start min-w-0'>
          <div className='flex flex-col truncate'>
            <h3 className='text-lg font-bold leading-tight hover:underline decoration-foreground/50'>
              {user.name}
            </h3>
            <p className='text-muted-foreground text-sm'>@{user.username}</p>
          </div>

          <div onClick={(e) => e.preventDefault()}>
            {user.isCurrentUser ? (
              <Button
                variant='outline'
                className='rounded-full cursor-pointer shadow-none'
                asChild
              >
                <Link href={`/profile/${user.username}/edit`}>
                  Edit profile
                </Link>
              </Button>
            ) : (
              <Button
                className='rounded-full cursor-pointer shadow-none'
                variant={user.isFollowing ? 'outline' : 'default'}
                onClick={() => toggleFollow(user.id)}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        {user.bio && (
          <p className='text-foreground/80 text-sm leading-normal whitespace-pre-wrap wrap-break-word'>
            {user.bio}
          </p>
        )}

        <div className='flex gap-4 pt-1'>
          <div className='flex gap-1 text-sm'>
            <span className='font-bold text-foreground/80'>
              {user?._count?.following ?? 0}
            </span>
            <span className='text-muted-foreground'>Following</span>
          </div>
          <div className='flex gap-1 text-sm'>
            <span className='font-bold text-foreground/80'>
              {user?._count?.followers ?? 0}
            </span>
            <span className='text-muted-foreground'>
              {user?._count?.followers === 1 ? 'Follower' : 'Followers'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
