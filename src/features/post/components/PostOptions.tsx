'use client';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import {
  Bookmark,
  Link2,
  MoreHorizontal,
  PencilLine,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDeletePost } from '../hooks/useDeletePost';
import { usePost } from '../PostProvider';
import { useToggleBookmark } from '@/features/bookmark/hooks/useToggleBookmark';
import EditPostDialog from './EditPostDialog';

export function PostOptions() {
  const { post } = usePost();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { deletePost, isDeleting } = useDeletePost();
  const { toggleBookmark, isToggling } = useToggleBookmark();
  const { data } = useSession();

  const isOwner = data?.user?.id === post.user.id;

  const handleDelete = () => deletePost(post.id);

  async function copyLink() {
    const url = `${window.location.origin}/${post.user.username!}/status/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  }

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
            onClick={copyLink}
            className='cursor-pointer rounded-md px-3 py-2 text-sm'
          >
            <Link2 className='h-4 w-4' />
            <span>Copy link</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer rounded-md px-3 py-2 text-sm'
            onClick={() => toggleBookmark(post.id)}
            disabled={isToggling}
          >
            <Bookmark
              className={cn(
                'h-4 w-4 opacity-70',
                post.isBookmarked && 'fill-current text-sky-500',
              )}
            />
            <span>{post.isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </DropdownMenuItem>

          {isOwner && (
            <>
              <DropdownMenuSeparator className='my-1' />
              <DropdownMenuItem
                onClick={() => setShowEditDialog(true)}
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

      {showDeleteDialog && (
        <ConfirmDialog
          onConfirm={handleDelete}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          disabled={isDeleting}
          title='Delete Post'
          description='Are you sure you want to delete this post'
        />
      )}

      {showEditDialog && (
        <EditPostDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}
