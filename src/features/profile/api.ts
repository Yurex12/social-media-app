import axios from 'axios';
import { PostFeedResponse } from '../post/types';
import { UserResponse, User } from './types';

export async function getProfile(username: string) {
  try {
    const user = await axios.get<User>(`/api/users/${username}`);
    return user.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch user');
    }
    throw error;
  }
}

export async function getUserLikedPosts(username: string, cursor?: string) {
  try {
    const { data } = await axios.get<PostFeedResponse>(
      `/api/users/${username}/likes`,
      {
        params: { cursor },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || 'Failed to fetch user likes',
      );
    }
    throw error;
  }
}

export async function getUserPosts(username: string, cursor?: string) {
  try {
    const { data } = await axios.get<PostFeedResponse>(
      `/api/users/${username}/posts`,
      {
        params: { cursor },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || 'Failed to fetch user posts',
      );
    }
    throw error;
  }
}

export async function getSuggestedUsers(limit?: number) {
  try {
    const { data } = await axios.get<User[]>(`/api/users/suggested`, {
      params: { limit },
    });
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || 'Failed to fetch suggestions',
      );
    }
    throw error;
  }
}

export async function getUserFollowers(username: string, cursor?: string) {
  try {
    const user = await axios.get<UserResponse>(
      `/api/users/${username}/followers`,
      { params: { cursor } },
    );

    return user.data;
  } catch (error: unknown) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch user');
    }
    throw error;
  }
}

export async function getUserFollowing(username: string, cursor?: string) {
  try {
    const { data } = await axios.get<UserResponse>(
      `/api/users/${username}/following`,
      { params: { cursor } },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch following');
    }
    throw error;
  }
}
