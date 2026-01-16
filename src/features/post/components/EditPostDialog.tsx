import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePost } from '../PostProvider';
import { EditPostForm } from './EditPostForm';

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function EditPostDialog({
  open,
  onOpenChange,
}: EditPostDialogProps) {
  const handleClose = () => onOpenChange(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
        </DialogHeader>
        <EditPostForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
