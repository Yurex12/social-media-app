import axios from 'axios';
import { PostFeedResponse } from '../post/types';
import { UserResponse } from '../profile/types';

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

export async function searchUsers({
  query,
  cursor,
}: {
  query: string;
  cursor?: string;
}) {
  try {
    const { data } = await axios.get<UserResponse>(`/api/search/users`, {
      params: { q: query, cursor },
    });
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to search users');
    }
    throw error;
  }
}
