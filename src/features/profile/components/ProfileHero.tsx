'use client';
import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { useProfile } from '../hooks/useProfile';
import { useToggleFollow } from '../hooks/useToggleFollow';

import { cn } from '@/lib/utils';
import { UserAvatar } from './UserAvatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EditProfileForm } from './EditProfileForm';
import { useSession } from '@/lib/auth-client';

import { MOBILE_BREAK_POINT } from '@/constants';

import { useLightboxStore } from '@/store/useLightboxStore';

export function ProfileHero() {
  const [openDialog, setOpenDialog] = useState(false);

  const { user, isPending, error } = useProfile();
  const { toggleFollow } = useToggleFollow();
  const { openLightbox } = useLightboxStore();

  const session = useSession();

  const router = useRouter();

  function handleEdit() {
    if (window.innerWidth >= MOBILE_BREAK_POINT) {
      setOpenDialog(true);
    } else {
      router.push(`/settings/profile`);
    }
  }

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

  if (!user) return <p>Something went wrong</p>;

  return (
    <>
      <div className='w-full max-w-140 mx-auto'>
        <div
          className={cn(
            'relative h-32 w-full bg-muted sm:h-48',
            user.coverImage && 'cursor-pointer',
          )}
          onClick={() =>
            user.coverImage && openLightbox(0, [{ url: user.coverImage }])
          }
        >
          {user.coverImage ? (
            <Image
              src={user.coverImage}
              alt='Banner'
              fill
              className='object-cover'
            />
          ) : (
            <div className='h-full w-full bg-muted' />
          )}
        </div>

        <div className='relative px-4'>
          <div className='flex justify-between items-start'>
            <div
              className={cn(user.image && 'cursor-pointer')}
              onClick={() =>
                user.image && openLightbox(0, [{ url: user.image }])
              }
            >
              <UserAvatar
                image={user.image}
                name={user.name}
                textClassName='text-4xl'
                className='-mt-12 h-24 w-24 sm:h-32 sm:w-32 border-4 border-background'
              />
            </div>

            <div className='mt-3'>
              {user.isCurrentUser ? (
                <Button
                  variant='outline'
                  className='rounded-full cursor-pointer'
                  onClick={handleEdit}
                  disabled={session.isPending}
                >
                  Edit profile
                </Button>
              ) : (
                <>
                  <Button
                    className='rounded-full cursor-pointer transition-none'
                    variant={user.isFollowing ? 'outline' : 'default'}
                    onClick={() => toggleFollow(user.id)}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className='mt-3 flex flex-col gap-3'>
            <div>
              <h2 className='text-xl font-extrabold leading-tight'>
                {user.name}
              </h2>

              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground text-[15px]'>
                  @{user.username}
                </span>

                {user.followsYou && !user.isCurrentUser && (
                  <span className='bg-muted text-muted-foreground text-[11px] font-medium px-1.5 py-0.5 rounded-sm leading-none shrink-0'>
                    Follows you
                  </span>
                )}
              </div>
            </div>

            {user.bio && (
              <p className='text-[15px] leading-normal'>{user.bio}</p>
            )}

            <div className='flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-[14px]'>
              <div className='flex items-center gap-1'>
                <CalendarDays size={16} />
                <span>
                  Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                </span>
              </div>
            </div>

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

      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent showCloseButton={false}>
            <EditProfileForm onClose={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
