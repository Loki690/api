import { FormModalProps } from "@/interfaces/IItem";
import { useDepartments } from "@/store/useDepartmentStore";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { addDepartment } from "@/services/DepartmentService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { departmentSchema } from "@/schema/departmentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
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

export default function DepartmentAddForm({ isOpen, onClose }: FormModalProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const { addDepartments } = useDepartments();
  const { mutate: departmentAdd, isPending } = addDepartment(projectId);

  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: "",
      departmentDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof departmentSchema>) {
    departmentAdd(values, {
      onSuccess: (data) => {
        addDepartments(data, projectId);
        queryClient.invalidateQueries({ queryKey: ["getDepartments"] });
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
            <DialogTitle>Add Department</DialogTitle>
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
                name="departmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="departmentDescription"
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
