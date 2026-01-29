import Link from 'next/link';
import { usePost } from '../PostProvider';
import { PostOptions } from './PostOptions';
import { UserAvatar } from '@/features/profile/components/UserAvatar';

export function PostHeader() {
  const {
    post: { user },
  } = usePost();
  return (
    <div className='flex items-center justify-between px-4 cursor-pointer'>
      <Link
        href={`/profile/${user.username}`}
        onClick={(e) => e.stopPropagation()}
        className='flex items-center gap-3 min-w-0 group z-10'
      >
        <UserAvatar image={user.image} name={user.name} />

        <span className='flex flex-col min-w-0'>
          <span className='font-semibold text-foreground/80 leading-none tracking-tight truncate group-hover:underline'>
            {user.name}
          </span>
          <span className='text-sm font-medium text-muted-foreground truncate'>
            @{user.username}
          </span>
        </span>
      </Link>

      <PostOptions />
    </div>
  );
}
