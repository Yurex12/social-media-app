import axios from 'axios';
import { PostWithRelations } from '../post/types';
import { UserWithRelations } from './types';

export async function getProfile(username: string) {
  try {
    const user = await axios.get<UserWithRelations>(`/api/users/${username}`);
    return user.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch user');
    }
    throw error;
  }
}
export async function getUserLikedPosts(username: string) {
  try {
    const user = await axios.get<PostWithRelations[]>(
      `/api/users/${username}/likes`,
    );
    return user.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || 'Failed to fetch users post',
      );
    }
    throw error;
  }
}
export async function getUserPosts(username: string) {
  try {
    const user = await axios.get<PostWithRelations[]>(
      `/api/users/${username}/posts`,
    );
    return user.data;
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
    const { data } = await axios.get<UserWithRelations[]>(
      `/api/users/suggested`,
      {
        params: { limit },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || 'Failed to fetch suggestions');
    }
    throw error;
  }
}
