import {
  Home,
  Search,
  Bell,
  User,
  Bookmark,
  LucideProps,
  Settings,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const MIN_USERNAME_LENGTH = 4;
export const MAX_USERNAME_LENGTH = 15;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MOBILE_BREAK_POINT = 640;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

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
    href: '/search',
    label: 'Search',
    Icon: Search,
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
  {
    href: '/settings',
    label: 'Settings',
    Icon: Settings,
  },
];
