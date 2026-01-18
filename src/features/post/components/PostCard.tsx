import { MediaGallery } from '@/components/MediaGallery';
import { TextExpander } from '@/components/TextExpander';

import { usePost } from '../PostProvider';
import { PostHeader } from './PostHeader';
import { PostInteractions } from './PostInteractions';

export function PostCard() {
  const {
    post: { content, images },
  } = usePost();

  return (
    <div className='max-w-140 mx-auto w-full space-y-2 border rounded-lg py-4'>
      <PostHeader />

      {content && <TextExpander content={content} />}

      {images.length > 0 && <MediaGallery images={images} />}

      <PostInteractions />
    </div>
  );
}
