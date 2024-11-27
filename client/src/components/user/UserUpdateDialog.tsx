import { ComponentPropsWithRef } from 'react';
import { User } from '@/types/UserTypes';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateUserFormSchema } from '@/schema/userFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '../ui/button';
import { updateUser } from '@/services/AddUserService';
import { toast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

interface UpdateUserSheetProps extends ComponentPropsWithRef<typeof Sheet> {
  users: User;
}

export default function UserUpdateDialog({
  users,
  ...props
}: UpdateUserSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      userCode: users.userCode,
      firstName: users.firstName,
      password: '',
      lastName: users.lastName,
      isAdmin: users.isAdmin || false,
      //project: users.project,
    },
  });

  const { mutate: userUpdate, isPending } = updateUser();

  const { updateUsers } = useUserStore();
  // const { data: projects = [] } = useQuery({
  //   queryKey: ["getProjects"],
  //   queryFn: () => getProjects(),
  // });

  function onSubmit(values: z.infer<typeof updateUserFormSchema>) {
    console.log(values);
    //need to change the api
    userUpdate(
      { userId: users._id, userData: values },
      {
        onSuccess: (data) => {
          updateUsers(data, users._id);
          queryClient.invalidateQueries({ queryKey: ['getUsers'] });
          toast({ title: `User Updated`, description: 'successfully updated' });
          props.onOpenChange?.(false);
        },
        onError: (err) => {
          toast({ title: `${err}` });
        },
      }
    );
  }
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update User</SheetTitle>
          <SheetDescription>
            Update the User details and save the changes
          </SheetDescription>
        </SheetHeader>
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
              name="isAdmin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'true')} // Convert string "true" or "false" to boolean
                    defaultValue={String(field.value)} // Convert current boolean to string for Select component
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Admin</SelectItem>
                      <SelectItem value="false">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button className="mt-2" type="submit" disabled={isPending}>
              {isPending ? (
                <LoaderCircle className="icon-size-5 animate-spin" />
              ) : (
                'Update'
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
