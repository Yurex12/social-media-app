import { Header } from '@/components/Header';
import Logo from '@/components/Logo';
import { RightSidebar } from '@/components/RightSidebar';
import { NotificationIcon } from '@/features/notification/components/NotificationIcon';
import { CreatePost } from '@/features/post/components/CreatePost';

import { PostList } from '@/features/post/components/PostList';
import { SearchInput } from '@/features/search/components/SearchInput';

export default async function Page() {
  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr]'>
      <div className='sm:space-y-4'>
        <Header>
          <div className='hidden sm:block w-full'>
            <SearchInput />
          </div>
          <div className='sm:hidden flex justify-between items-center w-full'>
            <Logo />
            <NotificationIcon />
          </div>
        </Header>

        <div className='flex items-center justify-center flex-col gap-4 sm:px-4 w-full'>
          <CreatePost />
          <PostList />
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
