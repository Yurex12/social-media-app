'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToggleBookmark } from '@/features/bookmark/hooks/useToggleBookmark';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import {
  Bookmark,
  Link2,
  MoreHorizontal,
  PencilLine,
  Trash2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDeletePost } from '../hooks/useDeletePost';
import { usePost } from '../PostProvider';
import EditPostDialog from './EditPostDialog';
import { useConfirmDialogStore } from '@/store/useConfirmDialogStore';
import { MOBILE_BREAK_POINT } from '@/constants';

import { MouseEvent } from 'react';

export function PostOptions() {
  const { post, user } = usePost();
  const { openConfirm } = useConfirmDialogStore();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { deletePost, isDeleting } = useDeletePost();
  const { toggleBookmark, isToggling } = useToggleBookmark();
  const { data } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  const isOwner = data?.user?.id === user.id;

  async function handleCopyLink() {
    const url = `${window.location.origin}/${user.username!}/status/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  }
  function handleEdit(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (window.innerWidth >= MOBILE_BREAK_POINT) {
      setShowEditDialog(true);
    } else {
      router.push(`/post/edit/${post.id}`);
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
            onClick={(e) => {
              e.stopPropagation();
              handleCopyLink();
            }}
            className='cursor-pointer rounded-md px-3 py-2 text-sm'
          >
            <Link2 className='h-4 w-4' />
            <span>Copy link</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer rounded-md px-3 py-2 text-sm'
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(post.id);
            }}
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
                onClick={handleEdit}
                className='cursor-pointer rounded-md px-3 py-2 text-sm'
              >
                <PencilLine className='h-4 w-4' />
                <span>Edit post</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className='cursor-pointer rounded-md px-3 py-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/10'
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();

                  const isDetailPage = pathname.includes(`/status/${post.id}`);

                  openConfirm({
                    resourceName: 'post',
                    onConfirm: () => {
                      if (isDetailPage) router.replace('/home');
                      deletePost(post.id);
                    },
                  });
                }}
              >
                <Trash2 className='h-4 w-4 text-destructive' />
                <span className='font-medium'>Delete post</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showEditDialog && (
        <EditPostDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}
