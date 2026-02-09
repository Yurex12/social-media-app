import { formatDistanceToNowStrict } from 'date-fns';

export function formatDate(date: Date | string | number) {
  const distance = formatDistanceToNowStrict(new Date(date));
  return distance.replace(/ (\w).*/, '$1');
}
