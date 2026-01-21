'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useProfile } from '../hooks/useProfile';

export function ProfileHeader() {
  const { username } = useParams();

  const { user, isPending, error } = useProfile(username as string);

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!user) return <p>No user yet</p>;

  console.log(user);

  return (
    <div className='w-full max-w-140 mx-auto'>
      {/* 1. Top Navigation Bar */}
      {/* <div className='flex items-center px-4 py-1 sticky top-0 bg-background/80 backdrop-blur-md z-20'>
        <BackButton title={user.name} />
        <span className='text-xs text-muted-foreground ml-10 mb-[-10px] absolute bottom-2'>
          {user._count.posts} posts
        </span>
      </div> */}

      {/* 2. Banner Section */}
      <div className='relative h-32 w-full bg-muted sm:h-48'>
        {user.image ? (
          <Image src={user.image} alt='Banner' fill className='object-cover' />
        ) : (
          <div className='h-full w-full bg-muted-foreground/20' />
        )}
      </div>

      {/* 3. Avatar & Action Button Row */}
      <div className='relative px-4'>
        <div className='flex justify-between items-start'>
          {/* Avatar - The negative margin creates the overlap */}
          <div className='relative -mt-12 h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-background bg-muted overflow-hidden'>
            <Image
              src={user.image || '/avatar-placeholder.png'}
              alt={user.name}
              fill
              className='object-cover'
            />
          </div>

          {/* Action Button */}
          <div className='mt-3'>
            {user.isCurrentUser ? (
              <Button variant='outline' className='rounded-full font-bold'>
                Edit profile
              </Button>
            ) : (
              <Button className='rounded-full font-bold bg-foreground text-background hover:bg-foreground/90'>
                Follow
              </Button>
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
            <div className='hover:underline cursor-pointer flex gap-1'>
              <span className='font-bold text-foreground'>
                {user._count.following}
              </span>
              <span className='text-muted-foreground'>Following</span>
            </div>
            <div className='hover:underline cursor-pointer flex gap-1'>
              <span className='font-bold text-foreground'>
                {user._count.followers}
              </span>
              <span className='text-muted-foreground'>Followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className='border-b border-border mt-4' />
    </div>
  );
}
