import { ComponentPropsWithRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Subprojects } from "@/types/SubprojectTypes";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { subprojectSchema } from "@/schema/subprojectFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubprojects } from "@/store/useSubproject";
import { updateSubproject } from "@/services/SubprojectService";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

interface UpdateSubprojectSheetProps
  extends ComponentPropsWithRef<typeof Sheet> {
  subprojects: Subprojects;
}

export default function SubprojectUpdateSheet({
  subprojects,
  ...props
}: UpdateSubprojectSheetProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof subprojectSchema>>({
    resolver: zodResolver(subprojectSchema),
    defaultValues: {
      subprojectName: subprojects.subprojectName,
      subprojectDescription: subprojects.subprojectDescription,
    },
  });

  const { putSubprojects } = useSubprojects();
  const { mutate: subprojectUpdate, isPending } = updateSubproject(projectId);

  function onSubmit(values: z.infer<typeof subprojectSchema>) {
    subprojectUpdate(
      { subprojectId: subprojects._id, subprojectData: values },
      {
        onSuccess: (data) => {
          putSubprojects(data, subprojects._id);
          queryClient.invalidateQueries({ queryKey: ["getSubprojects"] });
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
                name="subprojectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subproject</FormLabel>
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
