import { PostEntity } from '@/entities/postEntity';
import { selectPostById } from '@/entities/postSelectors';
import { useEntityStore } from '@/entities/store';
import { UserEntity } from '@/entities/userEntity';
import { selectUserById } from '@/entities/userSelectors';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface PostContextValue {
  post: PostEntity;
  user: UserEntity;
}

const PostContext = createContext<PostContextValue | undefined>(undefined);

export function PostProvider({
  children,
  postId,
}: {
  children: ReactNode;
  postId: string;
}) {
  const post = useEntityStore((state) => selectPostById(state, postId));

  const user = useEntityStore((state) => selectUserById(state, post?.userId));

  const value = useMemo(() => {
    if (!post || !user) return undefined;
    return { post, user };
  }, [post, user]);

  if (!value) return null;

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('Post context was used outside post provider.');
  }
  return context;
}
