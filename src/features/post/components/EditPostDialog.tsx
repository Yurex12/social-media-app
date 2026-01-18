import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
