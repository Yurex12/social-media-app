'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useConfirmDialogStore } from '@/store/useConfirmDialogStore';

export function ConfirmDialog() {
  const { isOpen, onConfirm, resourceName, closeConfirm, isLoading } =
    useConfirmDialogStore();

  return (
    <AlertDialog open={isOpen} onOpenChange={closeConfirm}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-left'>
            Delete {resourceName}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-left'>
            {' '}
            Are you sure you want to delete this {resourceName}? This action
            cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-row justify-end gap-3'>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-destructive/80 text-background hover:bg-destructive/70'
            disabled={isLoading}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
