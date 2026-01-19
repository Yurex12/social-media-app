import { Header } from '@/components/Header';
import { CreatePost } from '@/features/post/components/CreatePost';
import PostsList from '@/features/post/components/PostsList';

export default async function Posts() {
  return (
    <div className='space-y-4'>
      <Header />
      <CreatePost />

      <PostsList />
    </div>
  );
}
