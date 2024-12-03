import { ComponentPropsWithRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { StockIssuance } from '@/interfaces/IIssuing';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { issuanceListSchema } from '@/schema/issuingFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUsers } from '@/store/useUserStore';
import { useIssuanceList } from '@/store/useIssuanceStore';
import { IUserProps } from '@/interfaces/IAuth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  LoaderCircle,
} from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { updateIssuedItem } from '@/services/IssuanceService';
import { toast } from '@/hooks/use-toast';

interface UpdateIssuance extends ComponentPropsWithRef<typeof Sheet> {
  issuance: StockIssuance;
}

export default function IssuingUpdateSheet({
  issuance,
  ...props
}: UpdateIssuance) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const { data: users = [] } = useUsers(projectId) as {
    data?: IUserProps[];
  };
  const form = useForm<z.infer<typeof issuanceListSchema>>({
    resolver: zodResolver(issuanceListSchema),
    defaultValues: {
      dateIssued: new Date(),
      stockIssuanceNo: '',
      //department: '',
      projects: '',
      purpose: '',
      requisitioner: '',
      members: [],
      receivedBy: '',
      releasedBy: '',
      approvedBy: '',
      remarks: '',
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (issuance) {
      reset({
        dateIssued: issuance?.dateIssued || null,
        stockIssuanceNo: issuance?.stockIssuanceNo || '',
        //department: issuance?.department || '',
        projects: issuance?.projects || '',
        purpose: issuance?.purpose || '',
        requisitioner: issuance?.requisitioner?._id || '',
        members: issuance?.members?.map((member: any) => member._id) || [],
        receivedBy: issuance?.receivedBy?._id || '',
        releasedBy: issuance?.releasedBy?._id || '',
        approvedBy: issuance?.approvedBy?._id || '',
        remarks: issuance?.remarks || '',
      });
    }
  }, [issuance, reset]);

  function handleReleasedBySelect(itemId: any) {
    form.setValue('releasedBy', itemId); // Update the form's itemId value
  }
  function handleReceivedBySelect(itemId: any) {
    form.setValue('receivedBy', itemId); // Update the form's itemId value
  }
  function handleRequisitionerSelect(itemId: any) {
    form.setValue('requisitioner', itemId); // Update the form's itemId value
  }
  function handleApproverSelect(itemId: any) {
    form.setValue('approvedBy', itemId); // Update the form's itemId value
  }
  function handleMemberSelect(itemId: string) {
    const currentMembers = form.getValues('members');
    const updatedMembers = currentMembers.includes(itemId)
      ? currentMembers.filter((id: string) => id !== itemId) // Remove if already selected
      : [...currentMembers, itemId]; // Add if not selected

    form.setValue('members', updatedMembers); // Update the form with new array
  }

  const { updateIssuedItems } = useIssuanceList();
  const { mutate: issuedListUpdate, isPending } = updateIssuedItem(projectId);

  function onSubmit(values: z.infer<typeof issuanceListSchema>) {
    console.log(values);
    issuedListUpdate(
      { issuedItemId: issuance._id, issuedItemData: values },
      {
        onSuccess: (data) => {
          updateIssuedItems(data, issuance._id);
          queryClient.invalidateQueries({ queryKey: ['getIssuedItems'] });
          toast({
            title: 'Issuance updated',
            description: 'Issuing updated successfully',
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
            <SheetTitle>Update Issuance</SheetTitle>
            <SheetDescription>
              Update the issuance details and save the changes
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <div className="grid grid-cols-1 gap-2">
                <FormField
                  control={form.control}
                  name="dateIssued"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Issue</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {/* <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField> */}
                <FormField
                  control={form.control}
                  name="projects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <FormField
                  control={form.control}
                  name="requisitioner"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Requistioner</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'flex-1 justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? users.find(
                                    (requisitioner) =>
                                      requisitioner._id === field.value
                                  )?.firstName +
                                  ' ' +
                                  users.find(
                                    (requisitioner) =>
                                      requisitioner._id === field.value
                                  )?.lastName
                                : issuance?.requisitioner?.firstName ||
                                  'select a user'}
                              <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search Item..." />
                            <CommandList>
                              <CommandEmpty>No Item found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user: IUserProps) => (
                                  <CommandItem
                                    value={user.firstName + ' ' + user.lastName}
                                    key={user._id}
                                    onSelect={() => {
                                      form.setValue('requisitioner', user._id); // Set form itemId to user._id
                                      handleRequisitionerSelect(user._id); // Update selectedItem state
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2  w-4',
                                        user._id ===
                                          form.getValues('requisitioner') // Compare user._id with the value set in form
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {user.firstName} {user.lastName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approvedBy"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Verified and Approved By</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'flex-1 justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? users.find(
                                    (user: IUserProps) =>
                                      user._id === field.value
                                  )?.firstName +
                                  ' ' +
                                  users.find(
                                    (user: IUserProps) =>
                                      user._id === field.value
                                  )?.lastName
                                : 'Select approver'}
                              <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search User..." />
                            <CommandList>
                              <CommandEmpty>No Item found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user: IUserProps) => (
                                  <CommandItem
                                    value={user.firstName + ' ' + user.lastName}
                                    key={user._id}
                                    onSelect={() => {
                                      form.setValue('approvedBy', user._id); // Set form itemId to user._id
                                      handleApproverSelect(user._id); // Update selectedItem state
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2  w-4',
                                        user._id ===
                                          form.getValues('approvedBy') // Compare user._id with the value set in form
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {user.firstName} {user.lastName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="members"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Members</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'flex-1 justify-between',
                                !field.value.length && 'text-muted-foreground'
                              )}
                            >
                              {field.value.length > 0
                                ? field.value
                                    .map((id: string) => {
                                      const user = users.find(
                                        (u: { _id: string }) => u._id === id
                                      );
                                      return `${user?.firstName} ${user?.lastName}`;
                                    })
                                    .join(', ')
                                : 'Select Members'}
                              <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search Item..." />
                            <CommandList>
                              <CommandEmpty>No Item found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user: IUserProps) => (
                                  <CommandItem
                                    value={user.firstName + ' ' + user.lastName}
                                    key={user._id}
                                    onSelect={() =>
                                      handleMemberSelect(user._id)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2  w-4',
                                        form
                                          .getValues('members')
                                          .includes(user._id)
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {user.firstName} {user.lastName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <FormField
                  control={form.control}
                  name="receivedBy"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Received By</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'flex-1 justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? users.find(
                                    (user: IUserProps) =>
                                      user._id === field.value
                                  )?.firstName +
                                  ' ' +
                                  users.find(
                                    (user: IUserProps) =>
                                      user._id === field.value
                                  )?.lastName
                                : 'Select Received By'}
                              <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search User" />
                            <CommandList>
                              <CommandEmpty>No Item found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user: IUserProps) => (
                                  <CommandItem
                                    value={user.firstName + ' ' + user.lastName}
                                    key={user._id}
                                    onSelect={() => {
                                      form.setValue('receivedBy', user._id); // Set form itemId to user._id
                                      handleReceivedBySelect(user._id); // Update selectedItem state
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2  w-4',
                                        user._id ===
                                          form.getValues('receivedBy') // Compare user._id with the value set in form
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {user.firstName} {user.lastName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="releasedBy"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Released By</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'flex-1 justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? users.find(
                                    (user: IUserProps) =>
                                      user._id === field.value
                                  )?.firstName +
                                  ' ' +
                                  users.find(
                                    (user: IUserProps) =>
                                      user._id === field.value
                                  )?.lastName
                                : 'Select Released By'}
                              <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search User" />
                            <CommandList>
                              <CommandEmpty>No Item found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user: IUserProps) => (
                                  <CommandItem
                                    value={user.firstName + ' ' + user.lastName}
                                    key={user._id}
                                    onSelect={() => {
                                      form.setValue('releasedBy', user._id); // Set form itemId to user._id
                                      handleReleasedBySelect(user._id); // Update selectedItem state
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2  w-4',
                                        user._id ===
                                          form.getValues('releasedBy') // Compare user._id with the value set in form
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {user.firstName} {user.lastName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
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
