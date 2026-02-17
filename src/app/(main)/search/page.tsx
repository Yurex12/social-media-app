import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { RightSidebar } from '@/components/RightSidebar';
import { UsersSearchResults } from '@/features/search/components/UsersSearchResults';
import { PostsSearchResults } from '@/features/search/components/PostsSearchResults';

import { SearchInput } from '@/features/search/components/SearchInput';
import { SearchTabs } from '@/features/search/components/SearchTabs';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, f } = await searchParams;

  const activeTab = f || 'posts';
  const query = typeof q === 'string' ? q.trim() : '';

  return (
    <div className='grid xl:grid-cols-[1.2fr_0.8fr]'>
      <div className='border-r'>
        <Header className='gap-2 sm:gap-2'>
          {query && <BackButton />}
          <SearchInput key={query} />
        </Header>
        <SearchTabs />

        <div className='flex items-center justify-center flex-col gap-4 sm:px-4'>
          {!query && (
            <div className='flex flex-col items-center justify-center h-[70vh] text-muted-foreground'>
              <p className='text-lg font-medium'>Search for posts or people</p>
              <p className='text-sm'>
                Try searching for keywords, names, or usernames
              </p>
            </div>
          )}

          {query && activeTab === 'posts' && (
            <div className='w-full sm:pt-4'>
              <PostsSearchResults query={query} />
            </div>
          )}
          {query && activeTab === 'users' && (
            <div className='w-full sm:pt-4'>
              <UsersSearchResults query={query} />
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
