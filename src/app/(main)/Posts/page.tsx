import { Header } from '@/components/Header';
import { CreatePost } from '@/features/post/components/CreatePost';

import { PostsList } from '@/features/post/components/PostsList';
import { UserNavActions } from '@/features/profile/components/UserNavActions';
import { SearchInput } from '@/features/search/components/SearchInput';

export default async function Page() {
  return (
    <div className='grid grid-cols-[1.2fr_0.8fr]'>
      {/* right item */}
      <div className='border-r space-y-4'>
        <Header>
          <SearchInput />
          <UserNavActions />
        </Header>

        <div className='px-4 pb-2'>
          <CreatePost />
          <PostsList />
        </div>
      </div>
      {/* left item */}
      <div className='h-full w-full'></div>
    </div>
  );
}
