import { formatDistanceToNowStrict } from 'date-fns';

export function formatDate(date: Date) {
  return formatDistanceToNowStrict(new Date(date))
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' seconds', 's')
    .replace(' second', 's');
}
