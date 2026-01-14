import { createContext, ReactNode, useContext, useMemo } from 'react';
import { PostWithRelations } from './types';

interface PostContextValue {
  post: PostWithRelations;
}

const PostContext = createContext<PostContextValue | undefined>(undefined);

export function PostProvider({
  children,
  post,
}: {
  children: ReactNode;
  post: PostWithRelations;
}) {
  const value = useMemo(() => ({ post }), [post]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('Post context was used outside post provider.');
  }
  return context;
}
