import { ComponentPropsWithRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Departments } from "@/types/DepartmentTypes";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { departmentSchema } from "@/schema/departmentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDepartments } from "@/store/useDepartmentStore";
import { updateDepartment } from "@/services/DepartmentService";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

interface UpdateDepartmentSheetProps
  extends ComponentPropsWithRef<typeof Sheet> {
  departments: Departments;
}

export default function DepartmentUpdateSheet({
  departments,
  ...props
}: UpdateDepartmentSheetProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: departments.departmentName,
      departmentDescription: departments.departmentDescription,
    },
  });

  const { putDepartments } = useDepartments();
  const { mutate: departmentUpdate, isPending } = updateDepartment(projectId);

  function onSubmit(values: z.infer<typeof departmentSchema>) {
    departmentUpdate(
      { departmentId: departments._id, departmentData: values },
      {
        onSuccess: (data) => {
          putDepartments(data, departments._id);
          queryClient.invalidateQueries({ queryKey: ["getDepartments"] });
          toast({
            title: "Department updated",
            description: "Department updated successfully",
          });
          props.onOpenChange?.(false);
        },
        onError: (err) => {
          toast({
            title: `${err}`,
          });
        },
      }
    );
  }

  return (
    <div>
      <Sheet {...props}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Update Department</SheetTitle>
            <SheetDescription>
              Update the department and save the changes
            </SheetDescription>
          </SheetHeader>
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
                    <FormLabel>Department</FormLabel>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <Button className="mt-4" type="submit" disabled={isPending}>
                {isPending ? (
                  <LoaderCircle className="icon-size-5 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
