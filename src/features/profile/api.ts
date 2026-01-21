import axios from 'axios';
import { UserWithRelation } from './types';

export async function getProfile(username: string) {
  try {
    const user = await axios.get<UserWithRelation>(`/api/users/${username}`);
    return user.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch user');
    }
    throw error;
  }
}
