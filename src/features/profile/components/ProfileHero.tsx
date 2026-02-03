'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useProfile } from '../hooks/useProfile';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { UserAvatar } from './UserAvatar';

export function ProfileHero() {
  const { user, isPending, error } = useProfile();
  const { toggleFollow } = useToggleFollow();

  if (isPending)
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error)
    return (
      <div className='flex items-center justify-center h-dvh'>
        <p>{error.message}</p>
      </div>
    );

  if (!user) return <p>User not found</p>;
  return (
    <div className='w-full'>
      <div className='relative h-32 w-full bg-muted sm:h-48'>
        {/* change -> add coverImage to user table */}
        {user.image ? (
          <Image src={user.image} alt='Banner' fill className='object-cover' />
        ) : (
          <div className='h-full w-full bg-muted' />
        )}
      </div>

      <div className='relative px-4'>
        <div className='flex justify-between items-start'>
          <UserAvatar
            image={user.image}
            name={user.name}
            textClassName='text-4xl'
            className='-mt-12 h-24 w-24 sm:h-32 sm:w-32'
          />

          <div className='mt-3'>
            {user.isCurrentUser ? (
              <Button variant='outline' className='rounded-full cursor-pointer'>
                Edit profile
              </Button>
            ) : (
              <>
                <Button
                  className='rounded-full cursor-pointer'
                  variant={user.isFollowing ? 'outline' : 'default'}
                  onClick={() => toggleFollow(user.id)}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 4. User Info */}
        <div className='mt-3 flex flex-col gap-3'>
          <div>
            <h2 className='text-xl font-extrabold leading-tight'>
              {user.name}
            </h2>
            <p className='text-muted-foreground text-[15px]'>
              @{user.username}
            </p>
          </div>

          {user.bio && <p className='text-[15px] leading-normal'>{user.bio}</p>}

          {/* Metadata Row */}
          <div className='flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-[14px]'>
            <div className='flex items-center gap-1'>
              <CalendarDays size={16} />
              <span>
                Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className='flex gap-4 text-sm'>
            <Link
              href={`/profile/${user.username}/following`}
              className='hover:underline cursor-pointer flex gap-1 items-center'
            >
              <span className='font-bold text-foreground'>
                {user.followingCount}
              </span>
              <span className='text-muted-foreground'>Following</span>
            </Link>

            <Link
              href={`/profile/${user.username}/followers`}
              className='hover:underline cursor-pointer flex gap-1 items-center'
            >
              <span className='font-bold text-foreground'>
                {user.followersCount}
              </span>
              <span className='text-muted-foreground'>
                {user.followersCount === 1 ? 'Follower' : 'Followers'}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className='border-b border-border mt-4' />
    </div>
  );
}
