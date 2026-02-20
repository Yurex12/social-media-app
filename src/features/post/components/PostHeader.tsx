import Link from 'next/link';
import { usePost } from '../PostProvider';
import { PostOptions } from './PostOptions';
import { UserAvatar } from '@/features/profile/components/UserAvatar';

export function PostHeader() {
  const { user } = usePost();
  return (
    <div className='flex items-center justify-between px-2 sm:px-4 cursor-pointer gap-3'>
      <Link
        href={`/profile/${user.username}`}
        onClick={(e) => e.stopPropagation()}
        className='flex items-center gap-3 min-w-0 flex-1 group z-10'
      >
        <UserAvatar image={user.image} name={user.name} className='shrink-0' />

        <div className='flex flex-col min-w-0 flex-1 gap-0.5'>
          <span className='font-semibold text-foreground/80 leading-none tracking-tight line-clamp-1 group-hover:underline'>
            {user.name}
          </span>
          <span className='text-xs font-medium text-muted-foreground truncate'>
            @{user.username}
          </span>
        </div>
      </Link>

      <PostOptions />
    </div>
  );
}
