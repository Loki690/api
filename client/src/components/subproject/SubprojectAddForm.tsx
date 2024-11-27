import { toast } from "@/hooks/use-toast";
import { FormModalProps } from "@/interfaces/IItem";
import { subprojectSchema } from "@/schema/subprojectFormSchema";
import { addSubproject } from "@/services/SubprojectService";
import { useSubprojects } from "@/store/useSubproject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubprojectAddForm({ isOpen, onClose }: FormModalProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const { addSubprojects } = useSubprojects();
  const { mutate: subprojectAdd, isPending } = addSubproject(projectId);

  const form = useForm<z.infer<typeof subprojectSchema>>({
    resolver: zodResolver(subprojectSchema),
    defaultValues: {
      subprojectName: "",
      subprojectDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof subprojectSchema>) {
    subprojectAdd(values, {
      onSuccess: (data) => {
        addSubprojects(data, projectId);
        queryClient.invalidateQueries({ queryKey: ["getSubprojects"] });
        toast({
          title: "Department added",
          description: "Department added succesfully",
        });
        onClose();
      },
      onError: (err) => {
        toast({ title: "Error adding", description: `${err}` });
      },
    });
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Projects</DialogTitle>
            <DialogDescription>
              Make sure to input the correct information
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="subprojectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subproject Name</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="subprojectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Description</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle
                      className=" size-5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
