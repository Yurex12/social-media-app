import { usePost } from '../PostProvider';
import { PostOptions } from './PostOptions';
import { UserAvatar } from '@/features/profile/components/UserAvatar';

export function PostHeader() {
  const {
    post: { user },
  } = usePost();
  return (
    <div className='flex items-center justify-between px-4'>
      <div className='flex items-center gap-3 min-w-0'>
        <UserAvatar image={user.image} name={user.name} />

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
