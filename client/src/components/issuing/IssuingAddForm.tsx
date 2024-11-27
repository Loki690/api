import { toast } from '@/hooks/use-toast';
import { UpdateReceivingItemProps } from '@/interfaces/IReceiving';
import { issuanceListSchema } from '@/schema/issuingFormSchema';
import { addIssuedList } from '@/services/IssuanceService';
import { useIssuanceList } from '@/store/useIssuanceStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  LoaderCircle,
  PlusCircle,
  Trash2Icon,
} from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/Input';
import { IUserProps } from '@/interfaces/IAuth';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { IItemProps } from '@/interfaces/IItem';
import { IDepartments } from '@/interfaces/IDepartment';
import { ISubprojects } from '@/interfaces/ISubproject';

export default function IssuingAddForm({
  users,
  items,
  departments,
  subprojects,
  projects,
  issuanceNo,
}: UpdateReceivingItemProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const { addIssuedItem } = useIssuanceList();

  const { mutate: issuingItem, isPending } = addIssuedList(projectId);

  const form = useForm<z.infer<typeof issuanceListSchema>>({
    resolver: zodResolver(issuanceListSchema),
    defaultValues: {
      dateIssued: new Date(),
      stockIssuanceNo: (() => {
        // Extract the numeric portion of the last issuanceNo
        const lastIssuanceNo =
          issuanceNo?.stockIssuanceNo || projects?.prefix + '-0000-0000'; // Default if issuanceNo is missing
        const parts = lastIssuanceNo.split('-');
        const lastNumber = parts.pop(); // Extract the last segment
        const incrementedNumber = lastNumber
          ? String(parseInt(lastNumber, 10) + 1).padStart(4, '0') // Increment and pad to 4 digits
          : '0000-0001';
        // Construct the new stockIssuanceNo
        return projects.prefix
          ? `${projects.prefix}-0000-${incrementedNumber}`
          : `${parts.join('-')}-0000-${incrementedNumber}`;
      })(),
      department: '',
      projects: '',
      purpose: '',
      requisitioner: '',
      members: [],
      receivedBy: '',
      releasedBy: '',
      approvedBy: '',
      remarks: '',
      items: [{ item: '', qtyOut: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  console.log(projects?.prefix);
  function handleDepartmentSelect(itemId: any) {
    form.setValue('department', itemId); // Update the form's itemId value
  }
  function handleSubprojectSelect(itemId: any) {
    form.setValue('projects', itemId); // Update the form's itemId value
  }
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
  function handleItemSelect(index: number, itemId: string) {
    form.setValue(`items.${index}.item`, itemId); // Update the form's itemId value
  }

  function handleMemberSelect(itemId: string) {
    const currentMembers = form.getValues('members');
    const updatedMembers = currentMembers.includes(itemId)
      ? currentMembers.filter((id: string) => id !== itemId) // Remove if already selected
      : [...currentMembers, itemId]; // Add if not selected

    form.setValue('members', updatedMembers); // Update the form with new array
  }

  function onSubmit(values: z.infer<typeof issuanceListSchema>) {
    issuingItem(values, {
      onSuccess: (data) => {
        const normalizedData = Array.isArray(data) ? data : [data];
        normalizedData.forEach((item) => {
          addIssuedItem(item, projectId);
        });

        queryClient.invalidateQueries({ queryKey: ['getIssuedItems'] });
        queryClient.invalidateQueries({ queryKey: ['getIssuanceNo'] });
        toast({
          title: 'SIL Added',
          description: 'SIL successfully added',
        });
        form.reset({});
      },
      onError: (err) => {
        toast({ title: 'Error adding', description: `${err}` });
      },
    });
  }

  return (
    <div className="border rounded-md p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex gap-2">
              <div className="flex">
                <div className="grid grid-rows-6 items-center text-sm">
                  <p>Department </p>
                  <p>Project Name </p>
                  <p>Purpose</p>
                  <p>Requisitioner</p>
                  <p>Members</p>
                  <p>Remarks</p>
                </div>
              </div>
              <div className="flex-1 grid grid-rows-6 gap-2">
                <div className="">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'w-full md:w-1/2 justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? departments.find(
                                      (department: IDepartments) =>
                                        department._id === field.value
                                    )?.departmentName
                                  : 'Select Department'}
                                <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[320px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Department..." />
                              <CommandList>
                                <CommandEmpty>
                                  No Department Found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {departments.map(
                                    (department: IDepartments) => (
                                      <CommandItem
                                        value={department.departmentName}
                                        key={department._id}
                                        onSelect={() => {
                                          form.setValue(
                                            'department',
                                            department._id
                                          ); // Set form itemId to user._id
                                          handleDepartmentSelect(
                                            department._id
                                          ); // Update selectedItem state
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2  w-4',
                                            department._id ===
                                              form.getValues('department') // Compare user._id with the value set in form
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {department.departmentName}
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
                  <FormField
                    control={form.control}
                    name="projects"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'w-full md:w-1/2 justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? subprojects.find(
                                      (subproject: ISubprojects) =>
                                        subproject._id === field.value
                                    )?.subprojectName
                                  : 'Select Project'}
                                <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[320px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Project..." />
                              <CommandList>
                                <CommandEmpty>No Project Found.</CommandEmpty>
                                <CommandGroup>
                                  {subprojects.map(
                                    (subproject: ISubprojects) => (
                                      <CommandItem
                                        value={subproject.subprojectName}
                                        key={subproject._id}
                                        onSelect={() => {
                                          form.setValue(
                                            'projects',
                                            subproject._id
                                          ); // Set form itemId to user._id
                                          handleSubprojectSelect(
                                            subproject._id
                                          ); // Update selectedItem state
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2  w-4',
                                            subproject._id ===
                                              form.getValues('projects') // Compare user._id with the value set in form
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {subproject.subprojectName}
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full md:w-1/2"></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
                  <FormField
                    control={form.control}
                    name="requisitioner"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'w-full md:w-1/2 justify-between',
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
                                  : 'Select Requisitioner'}
                                <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[320px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Item..." />
                              <CommandList>
                                <CommandEmpty>No Item found.</CommandEmpty>
                                <CommandGroup>
                                  {users.map((user: IUserProps) => (
                                    <CommandItem
                                      value={
                                        user.firstName + ' ' + user.lastName
                                      }
                                      key={user._id}
                                      onSelect={() => {
                                        form.setValue(
                                          'requisitioner',
                                          user._id
                                        ); // Set form itemId to user._id
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
                </div>
                <div className="">
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'w-full justify-between',
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
                          <PopoverContent className="w-[630px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Item..." />
                              <CommandList>
                                <CommandEmpty>No Item found.</CommandEmpty>
                                <CommandGroup>
                                  {users.map((user: IUserProps) => (
                                    <CommandItem
                                      value={
                                        user.firstName + ' ' + user.lastName
                                      }
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

                <div className="">
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full"></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex justify-end">
                <div className="grid grid-rows-6 items-center text-sm">
                  <p>Stock Issuance No</p>
                  <p>Date Issue</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-rows-6 items-center gap-2">
                  <FormField
                    control={form.control}
                    name="stockIssuanceNo"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" readOnly></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateIssued"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full  pl-3 text-left font-normal',
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
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 border rounded-md p-2 flex flex-col gap-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-7 gap-2"
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.item`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-1">
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
                                ? items.find(
                                    (item: IItemProps) =>
                                      item._id === field.value
                                  )?.itemCode
                                : 'Select Item Code'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search Item..." />
                            <CommandList>
                              <CommandEmpty>No Item found.</CommandEmpty>
                              <CommandGroup>
                                {items.map((item: IItemProps) => (
                                  <CommandItem
                                    value={item.itemCode}
                                    key={item._id}
                                    onSelect={() => {
                                      form.setValue(
                                        `items.${index}.item`,
                                        item._id
                                      ); // Set form itemId to item._id
                                      handleItemSelect(index, item._id); // Update selectedItem state
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        item._id ===
                                          form.getValues(`items.${index}.item`) // Compare item._id with the value set in form
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {item.itemCode}
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
                  name={`items.${index}.item`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'flex-1 justify-between overflow-auto',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? items.find(
                                    (item: IItemProps) =>
                                      item._id === field.value
                                  )?.itemDescription
                                : 'Select Item Name'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[625px] p-0">
                          <Command>
                            <CommandInput placeholder="Search Item..." />
                            <CommandList>
                              <CommandEmpty>No Item found.</CommandEmpty>
                              <CommandGroup>
                                {items.map((item: IItemProps) => (
                                  <CommandItem
                                    value={item.itemDescription}
                                    key={item._id}
                                    onSelect={() => {
                                      form.setValue(
                                        `items.${index}.item`,
                                        item._id
                                      ); // Set form itemId to item._id
                                      handleItemSelect(index, item._id); // Update selectedItem state
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        item._id ===
                                          form.getValues(`items.${index}.item`) // Compare item._id with the value set in form
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {item.itemDescription}
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
                  name={`items.${index}.item`}
                  render={({ field }) => {
                    const selectedItem = items.find(
                      (item: IItemProps) =>
                        item._id === form.getValues(`items.${index}.item`)
                    );

                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={selectedItem?.unit || ''}
                            readOnly
                            placeholder="Unit"
                            className="text-center"
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.qtyOut`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="text-center"
                          placeholder="Quantity"
                          value={field.value === 0 ? '' : field.value} // Show placeholder if value is 0
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? 0 : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                  className=""
                >
                  <Trash2Icon className="text-red-900 w-5 h-5" />
                </Button>
              </div>
            ))}
            <div>
              <Button
                type="button"
                onClick={() => append({ item: '', qtyOut: 0 })}
                className="flex gap-2 h-9 mt-5"
              >
                <PlusCircle className="w-4 h-4" />
                Add Item
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FormField
              control={form.control}
              name="releasedBy"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-center">Released By</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full md:w-1/2  justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? users.find(
                                (user: IUserProps) => user._id === field.value
                              )?.firstName +
                              ' ' +
                              users.find(
                                (user: IUserProps) => user._id === field.value
                              )?.lastName
                            : 'Select Released By'}
                          <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
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
                                    user._id === form.getValues('releasedBy') // Compare user._id with the value set in form
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
              name="receivedBy"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-center">Received By</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full md:w-1/2 justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? users.find(
                                (user: IUserProps) => user._id === field.value
                              )?.firstName +
                              ' ' +
                              users.find(
                                (user: IUserProps) => user._id === field.value
                              )?.lastName
                            : 'Select Received By'}
                          <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
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
                                    user._id === form.getValues('receivedBy') // Compare user._id with the value set in form
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
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-center">
                    Verified and Approved By
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full md:w-1/2 justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? users.find(
                                (user: IUserProps) => user._id === field.value
                              )?.firstName +
                              ' ' +
                              users.find(
                                (user: IUserProps) => user._id === field.value
                              )?.lastName
                            : 'Select approver'}
                          <ChevronsUpDown className="ml-2  w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
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
                                    user._id === form.getValues('approvedBy') // Compare user._id with the value set in form
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
          <Button type="submit" disabled={isPending} className="mt-5">
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
    </div>
  );
}
