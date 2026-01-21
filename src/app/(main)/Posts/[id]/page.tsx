import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { PostDetails } from '@/features/post/components/PostDetails';

export default function Page() {
  return (
    <div className='grid grid-cols-[1.2fr_0.8fr] h-full'>
      <div className='border-r space-y-4'>
        <Header>
          <BackButton />
          <h3 className='text-lg font-semibold'>Post</h3>
        </Header>

        <PostDetails />
      </div>
    </div>
  );
}
