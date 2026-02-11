import { Header } from '@/components/Header';
import { RightSidebar } from '@/components/RightSidebar';
import { CreatePost } from '@/features/post/components/CreatePost';

import { PostList } from '@/features/post/components/PostList';
import { SearchInput } from '@/features/search/components/SearchInput';

export default async function Page() {
  return (
    <div className='grid grid-cols-[1.2fr_0.8fr]'>
      {/* right item */}
      <div className='border-r space-y-4'>
        <Header>
          <SearchInput />
        </Header>

        <div className='px-4 pb-2'>
          <CreatePost />
          <PostList />
        </div>
      </div>

      {/* left item */}
      <RightSidebar />
    </div>
  );
}
