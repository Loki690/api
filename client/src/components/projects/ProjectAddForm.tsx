import { toast } from '@/hooks/use-toast';
import { FormModalProps } from '@/interfaces/IItem';
import { projectFormSchema } from '@/schema/projectFormSchema';
import { addProjects } from '@/services/ProjectService';
import { useProjectStore } from '@/store/useProjectStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/Input';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';

export default function ProjectAddForm({ isOpen, onClose }: FormModalProps) {
  const queryClient = useQueryClient();
  const { addProject } = useProjectStore();
  const { mutate: projectAdd, isPending } = addProjects();

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Active',
      prefix: '',
    },
  });

  function onSubmit(values: z.infer<typeof projectFormSchema>) {
    projectAdd(values, {
      onSuccess: (data) => {
        addProject(data);
        queryClient.invalidateQueries({ queryKey: ['getProjects'] });
        toast({
          title: 'Project added',
          description: 'Project added succesfully',
        });
        onClose();
      },
      onError: (err) => {
        toast({ title: 'Error adding', description: `${err}` });
      },
    });
  }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Proejct</DialogTitle>
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
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle
                      className=" size-5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    'Submit'
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
