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
import { useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@/hooks/use-media-query';
import { deleteIssuedItems } from '@/services/IssuanceService';
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
import { StockIssuance } from '@/interfaces/IIssuing';

interface DeleteIssuingDialogProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  issuance: StockIssuance;
  onShowTrigger?: boolean;
  onSuccess?: () => void;
}

export default function IssuingDeleteDialog({
  issuance,
  onShowTrigger = false,
  ...props
}: DeleteIssuingDialogProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery('(min-width:640px)');

  const { mutate: deleteIssue, isPending } = deleteIssuedItems(projectId);

  function handleDelete() {
    deleteIssue(issuance._id, {
      onSuccess: () => {
        toast({
          title: 'Issuance Deleted',
          description: 'The issuance has been successfully deleted',
        });
        queryClient.invalidateQueries({ queryKey: ['getIssuedItems'] }),
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
