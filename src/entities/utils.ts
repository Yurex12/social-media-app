import { Post } from '@/features/post/types';
import { User } from '@/features/profile/types';
import { PostEntity } from './postEntity';
import { UserEntity } from './userEntity';

import { Comment } from '@/features/comment/types';

function mapUserEntity(user: User): UserEntity {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    bio: user.bio,
    isFollowing: user.isFollowing,
    followsYou: user.followsYou,
    isCurrentUser: user.isCurrentUser,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    postsCount: user.postsCount,
    createdAt: user.createdAt,
    coverImage: user.coverImage,
  };
}

// --- USERS ---
export function normalizeUser(user: User) {
  return { normalizedUser: mapUserEntity(user) };
}

export function normalizeUsers(users: User[]) {
  return { normalizedUsers: users.map(mapUserEntity) };
}

// --- POSTS ---
export function normalizePost(post: Post) {
  return {
    post: {
      id: post.id,
      content: post.content,
      images: post.images,
      userId: post.userId,
      isLiked: post.isLiked,
      isBookmarked: post.isBookmarked,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
    } satisfies PostEntity,
    user: mapUserEntity(post.user),
  };
}

export function normalizePosts(posts: Post[]) {
  const normalizedPosts: PostEntity[] = [];
  const normalizedUsers: UserEntity[] = [];

  posts.forEach((p) => {
    const { post, user } = normalizePost(p);
    normalizedPosts.push(post);
    normalizedUsers.push(user);
  });

  return { posts: normalizedPosts, users: normalizedUsers };
}

export function extractUsersFromComments(comments: Comment[]) {
  return comments.map((c) => mapUserEntity(c.user));
}
