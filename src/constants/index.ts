import { Home, Search, Bell, User, Bookmark, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const MIN_USERNAME_LENGTH = 4;
export const MAX_USERNAME_LENGTH = 15;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Link {
  href: string;
  label: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}

export const links: Link[] = [
  {
    href: '/home',
    label: 'Home',
    Icon: Home,
  },
  {
    href: '/notifications',
    label: 'Notifications',
    Icon: Bell,
  },
  {
    href: '/bookmarks',
    label: 'Bookmarks',
    Icon: Bookmark,
  },
  {
    href: '/profile',
    label: 'Profile',
    Icon: User,
  },
];
