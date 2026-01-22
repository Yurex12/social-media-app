import axios from 'axios';
import { SuggestedUsers, UserWithRelation } from './types';

export async function getProfile(username: string) {
  try {
    const user = await axios.get<UserWithRelation>(`/api/users/${username}`);
    return user.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch user');
    }
    throw error;
  }
}

export async function getSuggestedUsers(limit?: number) {
  try {
    const { data } = await axios.get<SuggestedUsers[]>(`/api/users/suggested`, {
      params: { limit },
    });
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || 'Failed to fetch suggestions');
    }
    throw error;
  }
}
