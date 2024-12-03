import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useUserStore } from '@/store/useUserStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { userFormSchema } from '@/schema/userFormSchema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/Input';
import { Button } from '../ui/button';
import { useCreateUserWithProject } from '@/services/AddUserService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from '@/hooks/use-toast';
import { FormModalProps } from '@/interfaces/IItem';
import { LoaderCircle } from 'lucide-react';

export default function UserAddForm({ isOpen, onClose }: FormModalProps) {
  const queryClient = useQueryClient();
  const { addUsers, getProjects } = useUserStore();

  const { mutate: userAdd, isPending } = useCreateUserWithProject();

  const { data: projects = [] } = useQuery({
    queryKey: ['getProjects'],
    queryFn: () => getProjects(),
  });

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userCode: '',
      firstName: '',
      lastName: '',
      role: '',
      password: '',
      project: '',
    },
  });

  function onSubmit(values: z.infer<typeof userFormSchema>) {
    console.log(values);
    userAdd(values, {
      onSuccess: (data) => {
        addUsers(data);
        queryClient.invalidateQueries({ queryKey: ['getUsers'] });
        toast({
          title: 'User Added',
          description: 'Successfully register',
        });
        form.reset();
        onClose();
      },
      onError: (err) => {
        toast({ title: `${err}` });
      },
    });
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register a user</DialogTitle>
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
                name="userCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Code</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password"></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)} // Convert to boolean
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Head">Department Head</SelectItem>
                        <SelectItem value="Inventory">
                          Inventory Officer
                        </SelectItem>
                        <SelectItem value="Crew">Crew</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)} // Update value on change
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects?.map((project: any) => (
                          <SelectItem key={project._id} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle className="size-4 animate-spin" />
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
