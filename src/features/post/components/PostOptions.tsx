'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Link2,
  Bookmark,
  PencilLine,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostOptionsProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
  onBookmark: () => void;
  isBookmarked?: boolean;
}

export function PostOptions({
  isOwner,
  onEdit,
  onDelete,
  onCopyLink,
  onBookmark,
  isBookmarked,
}: PostOptionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className='flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none'>
          <MoreHorizontal className='h-5 w-5' />
          <span className='sr-only'>Open options</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-52 p-1.5 shadow-xl'>
        {/* GROUP 1: Utilities */}
        <DropdownMenuItem
          onClick={onCopyLink}
          className='gap-3 px-3 py-2.5 cursor-pointer'
        >
          <Link2 className='h-4 w-4 opacity-70' />
          <span className='font-medium'>Copy link</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onBookmark}
          className='gap-3 px-3 py-2.5 cursor-pointer'
        >
          <Bookmark
            className={cn(
              'h-4 w-4 opacity-70',
              isBookmarked && 'fill-current text-sky-500'
            )}
          />
          <span className='font-medium'>
            {isBookmarked ? 'Saved' : 'Bookmark'}
          </span>
        </DropdownMenuItem>

        {/* GROUP 2: Management (Only shown to owner) */}
        {isOwner && (
          <>
            <DropdownMenuSeparator className='my-1' />
            <DropdownMenuItem
              onClick={onEdit}
              className='gap-3 px-3 py-2.5 cursor-pointer'
            >
              <PencilLine className='h-4 w-4 opacity-70' />
              <span className='font-medium'>Edit post</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onDelete}
              className='gap-3 px-3 py-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'
            >
              <Trash2 className='h-4 w-4' />
              <span className='font-medium'>Delete post</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
