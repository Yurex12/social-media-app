// PostCard.tsx

import { MediaGallery } from '@/components/MediaGallery';
import { TextExpander } from '@/components/TextExpander';
import { useRouter } from 'next/navigation';

import { usePost } from '../PostProvider';
import { PostHeader } from './PostHeader';
import { PostInteractions } from './PostInteractions';

export function PostCard() {
  const router = useRouter();
  const { post, user } = usePost();

  const handleCardClick = () =>
    router.push(`/${user.username}/status/${post.id}`);

  return (
    <div
      className='space-y-2 py-4 hover:cursor-pointer sm:border sm:rounded-lg w-full border-b rounded-none max-w-140'
      onClick={handleCardClick}
    >
      <PostHeader />

      {post.content && <TextExpander content={post.content} />}

      {post.images.length > 0 && <MediaGallery images={post.images} />}

      <PostInteractions />
    </div>
  );
}
