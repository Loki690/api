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
import { Projects } from '@/types/ProjectTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import { deleteProjects } from '@/services/ProjectService';
import { toast } from '@/hooks/use-toast';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';

interface DeleteProjectsDialogProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  projects: Projects;
  onSuccess?: () => void;
}

export default function ProjectDeleteDialog({
  projects,
  ...props
}: DeleteProjectsDialogProps) {
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery('(min-width:640px)');

  const { mutate: deleteProject, isPending } = deleteProjects();

  function handleDelete() {
    deleteProject(projects._id, {
      onSuccess: () => {
        toast({
          title: 'Project deleted',
          description: 'The item has been succesfully deleted',
        });
        queryClient.invalidateQueries({ queryKey: ['getProjects'] });
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
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={handleDelete}
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
            onClick={handleDelete}
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
