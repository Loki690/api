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
import { ReceivedItem } from '@/types/ReceivedItemTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@/hooks/use-media-query';
import { deleteReceivedItem } from '@/services/ReceivingService';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';

interface DeleteReceivedItemsProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  receivedItems: ReceivedItem;
  onSuccess?: () => void;
}

export default function ReceivingDeleteDialog({
  receivedItems,
  ...props
}: DeleteReceivedItemsProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery('(min-width:640px)');
  const { mutate: deleteItem, isPending } = deleteReceivedItem(projectId);

  function handleDelete() {
    deleteItem(receivedItems._id, {
      onSuccess: () => {
        toast({
          title: 'Item Deleted',
          description: 'The item has been successfully deleted',
        });
        queryClient.invalidateQueries({ queryKey: ['getReceivedItems'] }),
          props.onOpenChange?.(false);
      },
    });
  }

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
            <Button aria-label="Delete row" onClick={handleDelete}>
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
          <Button aria-label="Delete selected rows" onClick={handleDelete}>
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
