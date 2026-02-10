import { PostWithRelations } from '@/features/post/types';
import { UserWithRelations } from '@/features/profile/types';
import { PostEntity } from './postEntity';
import { UserEntity } from './userEntity';

import { CommentWithRelations } from '@/features/comment/types';

function mapUserEntity(user: UserWithRelations): UserEntity {
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
  };
}

// --- USERS ---
export function normalizeUser(user: UserWithRelations) {
  return { normalizedUser: mapUserEntity(user) };
}

export function normalizeUsers(users: UserWithRelations[]) {
  return { normalizedUsers: users.map(mapUserEntity) };
}

// --- POSTS ---
export function normalizePost(post: PostWithRelations) {
  return {
    post: {
      id: post.id,
      content: post.content,
      images: post.images,
      userId: post.user.id,
      isLiked: post.isLiked,
      isBookmarked: post.isBookmarked,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
    } satisfies PostEntity,
    user: mapUserEntity(post.user),
  };
}

export function normalizePosts(posts: PostWithRelations[]) {
  const normalizedPosts: PostEntity[] = [];
  const normalizedUsers: UserEntity[] = [];

  posts.forEach((p) => {
    const { post, user } = normalizePost(p);
    normalizedPosts.push(post);
    normalizedUsers.push(user);
  });

  return { posts: normalizedPosts, users: normalizedUsers };
}

export function extractUsersFromComments(comments: CommentWithRelations[]) {
  return comments.map((c) => mapUserEntity(c.user));
}
