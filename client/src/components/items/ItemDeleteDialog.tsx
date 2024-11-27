import { ComponentPropsWithoutRef } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Items } from '@/types/ItemTypes';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '../ui/button';
import { LoaderCircle, Trash } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { deleteItem } from '@/services/ItemService';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface DeleteItemsDialogProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  items: Items;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export default function ItemDeleteDialog({
  items,
  showTrigger = false,
  ...props
}: DeleteItemsDialogProps) {
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery('(min-width:640px)');
  const { projectId } = useParams() as { projectId: string };
  const { mutate: deleteItems, isPending } = deleteItem(projectId);
  function handleDelete() {
    deleteItems(items._id, {
      onSuccess: () => {
        toast({
          title: 'Item Deleted',
          description: 'The item has been successfully deleted.',
        });
        queryClient.invalidateQueries({ queryKey: ['getItems'] }); // Invalidate cache
        props.onOpenChange?.(false);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `Failed to delete the item: ${error} `,
        });
      },
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry? {items.itemCode}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button aria-label="Delete selected rows" onClick={handleDelete}>
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
      {showTrigger ? (
        <DialogTrigger>
          <Button variant="outline">
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </Button>
        </DialogTrigger>
      ) : null}
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
