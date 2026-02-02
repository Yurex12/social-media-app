import { PostWithRelations } from '@/features/post/types';
import { PostEntity } from './postEntity';
import { UserEntity } from './userEntity';

export function normalizePost(post: PostWithRelations): {
  post: PostEntity;
  user: UserEntity;
} {
  const user: UserEntity = {
    id: post.user.id,
    name: post.user.name,
    username: post.user.username,
    image: post.user.image,
    bio: post.user.bio,
    isFollowing: post.user.isFollowing,
    isCurrentUser: post.user.isCurrentUser,
    followersCount: post.user._count.followers,
    followingCount: post.user._count.following,
    postsCount: post.user._count.posts,
    createdAt: post.user.createdAt,
  };

  const normalizedPost: PostEntity = {
    id: post.id,
    content: post.content,
    images: post.images,
    userId: post.userId,
    isLiked: post.isLiked,
    isBookmarked: post.isBookmarked,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    createdAt: post.createdAt,
  };

  return { post: normalizedPost, user };
}

export function normalizePosts(posts: PostWithRelations[]): {
  posts: PostEntity[];
  users: UserEntity[];
} {
  const normalizedPosts: PostEntity[] = [];
  const normalizedUsers: UserEntity[] = [];

  posts.forEach((post) => {
    const { post: normalizedPost, user } = normalizePost(post);
    normalizedPosts.push(normalizedPost);
    normalizedUsers.push(user);
  });

  return { posts: normalizedPosts, users: normalizedUsers };
}
