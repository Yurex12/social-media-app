import axios from 'axios';
import { NotificationWithRelations } from './types';

export async function getNotifications() {
  try {
    const posts =
      await axios.get<NotificationWithRelations[]>('/api/notifications');
    return posts.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || 'Failed to fetch notifications',
      );
    }
    throw error;
  }
}
