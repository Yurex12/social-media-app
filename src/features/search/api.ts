import axios from 'axios';
import { PostFeedResponse } from '../post/types';
import { UserWithRelations } from '../profile/types';

// For the "Posts" tab
export async function searchPosts(query: string, cursor?: string) {
  try {
    const { data } = await axios.get<PostFeedResponse>(`/api/search/posts`, {
      params: { q: query, cursor },
    });

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to search posts');
    }
    throw error;
  }
}

export async function searchUsers(query: string) {
  try {
    const { data } = await axios.get<UserWithRelations[]>(`/api/search/users`, {
      params: { q: query },
    });
    return data;
  } catch (error: unknown) {
    console.error(error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to search users');
    }
    throw error;
  }
}
