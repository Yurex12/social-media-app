import { getRequiredSession } from '@/lib/session';
import Post from './Post';
import PostCard from '@/components/Post';

export default async function Posts() {
  // const session = await getRequiredSession();

  return (
    <div>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <PostCard key={num} />
      ))}
    </div>
  );
}
