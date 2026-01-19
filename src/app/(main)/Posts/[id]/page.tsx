import { Header } from '@/components/Header';
import { PostDetails } from '@/features/post/components/PostDetails';

export default function Page() {
  return (
    <div className='flex flex-col h-full pb-2'>
      <Header />
      <PostDetails />;
    </div>
  );
}
