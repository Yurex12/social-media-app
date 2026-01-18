import { CreatePost } from '@/features/post/components/CreatePost';
import PostsList from '@/features/post/components/PostsList';

export default async function Posts() {
  return (
    <div>
      <CreatePost />

      <PostsList />
    </div>
  );
}
