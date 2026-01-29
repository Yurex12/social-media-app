import { MediaGallery } from '@/components/MediaGallery';
import { TextExpander } from '@/components/TextExpander';

import { usePost } from '../PostProvider';
import { PostHeader } from './PostHeader';
import { PostInteractions } from './PostInteractions';
import { useRouter } from 'next/navigation';

export function PostCard() {
  const router = useRouter();
  const { post } = usePost();

  const handleCardClick = () => {
    router.push(`/${post.user.username!}/status/${post.id}`);
  };

  return (
    <div
      className='space-y-2 border rounded-lg py-4 hover:cursor-pointer'
      onClick={handleCardClick}
    >
      <PostHeader />

      {post.content && <TextExpander content={post.content} />}

      {post.images.length > 0 && <MediaGallery images={post.images} />}

      <PostInteractions />
    </div>
  );
}
