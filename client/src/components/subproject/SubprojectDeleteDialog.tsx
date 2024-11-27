import { ComponentPropsWithoutRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useParams } from "react-router-dom";
import { deleteSubprojects } from "@/services/SubprojectService";
import { toast } from "@/hooks/use-toast";
import { Subprojects } from "@/types/SubprojectTypes";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

interface DeleteSubprojectDialogProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  subprojects: Subprojects;
  onSuccess?: () => void;
}

export default function SubprojectDeleteDialog({
  subprojects,
  ...props
}: DeleteSubprojectDialogProps) {
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width:640px)");
  const { projectId } = useParams() as { projectId: string };
  const { mutate: deleteSubproject, isPending } = deleteSubprojects(projectId);
  function handleDelete() {
    deleteSubproject(subprojects._id, {
      onSuccess: () => {
        toast({
          title: "Subproject deleted",
          description: "The subproject has been succesfully deleted.",
        });
        queryClient.invalidateQueries({ queryKey: ["getSubprojects"] });
        props.onOpenChange?.(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to delete the item:${error}`,
        });
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
