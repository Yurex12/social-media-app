import { MediaGallery } from '@/components/MediaGallery';
import { TextExpander } from '@/components/TextExpander';
import { PostWithRelations } from '../types';

import { PostHeader } from './PostHeader';
import { PostInteractions } from './PostInteractions';

export function PostCard(post: PostWithRelations) {
  return (
    <div className='max-w-140 w-full space-y-2 border rounded-lg py-4'>
      <PostHeader user={post.user} />

      {post.content && <TextExpander content={post.content} />}

      {post.images.length > 0 && <MediaGallery images={post.images} />}

      <PostInteractions post={post} />
    </div>
  );
}
