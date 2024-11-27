import { ComponentPropsWithRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Projects } from '@/types/ProjectTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { projectFormSchema } from '@/schema/projectFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjectStore } from '@/store/useProjectStore';
import { updateProjects } from '@/services/ProjectService';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/Input';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';

interface UpdateProjectSheetProps extends ComponentPropsWithRef<typeof Sheet> {
  projects: Projects;
}

export default function ProjectUpdateSheet({
  projects,
  ...props
}: UpdateProjectSheetProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: projects.name,
      description: projects.description,
      status: 'Active',
      prefix: projects?.prefix,
    },
  });

  const { updateProject } = useProjectStore();
  const { mutate: projectUpdate, isPending } = updateProjects();

  function onSubmit(values: z.infer<typeof projectFormSchema>) {
    projectUpdate(
      { projectId: projects._id, projectData: values },
      {
        onSuccess: (data) => {
          updateProject(data, projects._id);
          queryClient.invalidateQueries({ queryKey: ['getProjects'] });
          toast({
            title: 'Project updated',
            description: 'Project updated succesfully',
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
            <SheetTitle>Update Project</SheetTitle>
            <SheetDescription>
              Give you project name little bit more interesting
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefix</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>

              <Button type="submit" disabled={isPending} className="mt-2">
                {isPending ? (
                  <LoaderCircle
                    className=" size-5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
