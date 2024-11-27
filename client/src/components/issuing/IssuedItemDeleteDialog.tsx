import { ComponentPropsWithoutRef } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@/hooks/use-media-query';
import { deleteItemIssued } from '@/services/IssuanceService';
import { toast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '../ui/drawer';

interface DeleteItemIssuedDialogProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  itemId: string | null; // ID of the item to delete
  issuanceId: string; // ID of the issuance
  onSuccess?: () => void;
}

export default function IssuedItemDeleteDialog({
  itemId,
  issuanceId,
  ...props
}: DeleteItemIssuedDialogProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery('(min-width:640px)');
  const { mutate: deleteItem, isPending } = deleteItemIssued(projectId);

  function handleDelete(itemId: string, issuanceId: string) {
    deleteItem(
      {
        issuanceId,
        itemId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Issued Item deleted successfully',
          });
          queryClient.invalidateQueries({ queryKey: ['getIssuedItems'] });
          props.onOpenChange?.(false);
        },
        onError: (error: Error) => {
          toast({
            title: 'Error deleting issued item',
            description: error.message,
          });
        },
      }
    );
  }

  const handleConfirmDelete = () => {
    if (itemId && issuanceId) {
      handleDelete(itemId, issuanceId);
    }
  };

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete row"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {isPending && (
                <LoaderCircle
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delete Confirmation</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to delete this entry?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={handleConfirmDelete}
          >
            {isPending && (
              <LoaderCircle
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
