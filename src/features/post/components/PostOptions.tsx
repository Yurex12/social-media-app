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
import { useDeletePost } from '../hooks/useDeletePost';
import { usePost } from '../PostProvider';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useState } from 'react';

export function PostOptions() {
  const { post } = usePost();
  const { deletePost, isDeleting } = useDeletePost();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isBookmarked = false;
  const isOwner = true;

  const handleDelete = () => deletePost(post.id);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none'>
            <MoreHorizontal className='h-5 w-5' />
            <span className='sr-only'>Open options</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-52 p-1.5 shadow-xl'>
          <DropdownMenuItem
            onClick={() => {}}
            className='cursor-pointer rounded-md px-3 py-2 text-sm'
          >
            <Link2 className='h-4 w-4' />
            <span>Copy link</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {}}
            className='cursor-pointer rounded-md px-3 py-2 text-sm'
          >
            <Bookmark
              className={cn(
                'h-4 w-4 opacity-70',
                isBookmarked && 'fill-current text-sky-500'
              )}
            />
            <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </DropdownMenuItem>

          {isOwner && (
            <>
              <DropdownMenuSeparator className='my-1' />
              <DropdownMenuItem
                onClick={() => {}}
                className='cursor-pointer rounded-md px-3 py-2 text-sm'
              >
                <PencilLine className='h-4 w-4' />
                <span>Edit post</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className='cursor-pointer rounded-md px-3 py-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/10'
                disabled={isDeleting}
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className='h-4 w-4 text-destructive' />
                <span className='font-medium'>Delete post</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        onConfirm={handleDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title='Delete Post'
        description='Are you sure you want to delete this post'
      ></ConfirmDialog>
    </>
  );
}
