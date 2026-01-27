import axios from 'axios';
import { PostWithRelations } from '../post/types';
import { UserWithRelations } from '../profile/types';

// For the "Posts" tab
export async function searchPosts(query: string) {
  try {
    const { data } = await axios.get<PostWithRelations[]>(`/api/search/posts`, {
      params: { q: query },
    });

    console.log(query);

    return data;
  } catch (error: unknown) {
    console.error(error);
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
