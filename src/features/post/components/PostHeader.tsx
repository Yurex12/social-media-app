import Image from 'next/image';

import { usePost } from '../PostProvider';
import { PostOptions } from './PostOptions';

export function PostHeader() {
  const {
    post: { user },
  } = usePost();
  return (
    <div className='flex items-center justify-between px-4'>
      <div className='flex items-center gap-3 min-w-0'>
        <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted'>
          <Image
            src={user?.image || '/avatar-placeholder.png'}
            alt={user.name ?? 'User'}
            fill
            className='object-cover'
            referrerPolicy='no-referrer'
          />
        </div>

        <div className='flex flex-col min-w-0'>
          <h2 className='font-semibold leading-none tracking-tight truncate'>
            {user.name}
          </h2>
          <p className='text-xs font-medium text-muted-foreground truncate'>
            @{user.username}
          </p>
        </div>
      </div>

      <PostOptions />
    </div>
  );
}
