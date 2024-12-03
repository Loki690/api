import { toast } from '@/hooks/use-toast';
import { UpdateReceivingItemProps } from '@/interfaces/IReceiving';
import { issuanceListSchema } from '@/schema/issuingFormSchema';
import { updateIssuedItem } from '@/services/IssuanceService';
import { useIssuanceList } from '@/store/useIssuanceStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
import { StockIssuance } from '@/interfaces/IIssuing';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  LoaderCircle,
  PlusCircle,
  Trash2Icon,
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { IItemProps } from '@/interfaces/IItem';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/Input';
import { IUserProps } from '@/interfaces/IAuth';
import { IDepartments } from '@/interfaces/IDepartment';
import { ISubprojects } from '@/interfaces/ISubproject';

export default function IssuingUpdateForm({
  users,
  issuing,
  items,
  //departments,
  subprojects,
}: UpdateReceivingItemProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const [selectedIssuing, setSelectedIssuing] = useState<StockIssuance | null>(
    null
  ); // Track selected item

  const form = useForm<z.infer<typeof issuanceListSchema>>({
    resolver: zodResolver(issuanceListSchema),
    defaultValues: {
      dateIssued: issuing?.dateIssued,
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
      items: [{ item: '', qtyOut: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const { reset } = form;
  useEffect(() => {
    if (issuing) {
      reset({
        dateIssued: issuing?.dateIssued || '',
        stockIssuanceNo: issuing?.stockIssuanceNo || '',
        //department: issuing?.department?._id || '',
        projects: issuing?.projects?._id || '',
        purpose: issuing?.purpose || '',
        requisitioner: issuing?.requisitioner?._id || '',
        members: issuing?.members?.map((member: any) => member._id) || [],
        receivedBy: issuing?.receivedBy?._id || '',
        releasedBy: issuing?.releasedBy?._id || '',
        approvedBy: issuing?.approvedBy?._id || '',
        remarks: issuing.remarks || '',
        items: [{ item: issuing._id, qtyOut: issuing.qtyOut }],
      });
    }
  }, [issuing, reset]);
  // function handleDepartmentSelect(itemId: any) {
  //   form.setValue('department', itemId); // Update the form's itemId value
  // }
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
  function handleMemberSelect(itemId: string) {
    const currentMembers = form.getValues('members');
    const updatedMembers = currentMembers.includes(itemId)
      ? currentMembers.filter((id: string) => id !== itemId) // Remove if already selected
      : [...currentMembers, itemId]; // Add if not selected

    form.setValue('members', updatedMembers); // Update the form with new array
  }
  function handleItemSelect(index: number, itemId: string) {
    form.setValue(`items.${index}.item`, itemId); // Update the form's itemId value
  }

  const { updateIssuedItems } = useIssuanceList();
  const { mutate: issuedListUpdate, isPending } = updateIssuedItem(projectId);

  function onSubmit(values: z.infer<typeof issuanceListSchema>) {
    const { stockIssuanceNo, ...rest } = values;
    issuedListUpdate(
      { issuedItemId: selectedIssuing?._id, issuedItemData: rest },
      {
        onSuccess: (data) => {
          // Normalize `data` to an array if it's a single item
          const normalizedData = Array.isArray(data) ? data : [data];
          // Update the state with the normalized data
          normalizedData.forEach((item) => {
            updateIssuedItems(item, item._id);
          });
          queryClient.invalidateQueries({ queryKey: ['getIssuedItems'] });
          toast({
            title: 'Issuance updated',
            description: 'Issuing updated successfully',
          });
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
                  <p>Project Name </p>
                  <p>Purpose</p>
                  <p>Requisitioner</p>
                  <p>Members</p>
                  <p>Remarks</p>
                </div>
              </div>
              <div className="flex-1 grid grid-rows-6 gap-2">
                {/* <div className="">
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
                </div> */}
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
                    render={({ field }) => {
                      const filteredUser = users.filter(
                        (user: IUserProps) => user.role === 'Crew'
                      );
                      return (
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
                                    ? filteredUser.find(
                                        (user: IUserProps) =>
                                          user._id === field.value
                                      )?.firstName +
                                      ' ' +
                                      filteredUser.find(
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
                                    {filteredUser.map((user: IUserProps) => (
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
                      );
                    }}
                  />
                </div>
                <div className="">
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => {
                      const filteredUser = users.filter(
                        (user: IUserProps) => user.role === 'Crew'
                      );
                      return (
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
                                    !field.value.length &&
                                      'text-muted-foreground'
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
                                    {filteredUser.map((user: IUserProps) => (
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
                      );
                    }}
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
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="stockIssuanceNo"
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
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? issuing.find(
                                        (issued: StockIssuance) =>
                                          issued._id === field.value
                                      )?.stockIssuanceNo
                                    : 'Select a SIL no.'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[350px] p-0">
                              <Command>
                                <CommandInput placeholder="Search SIL" />
                                <CommandList>
                                  <CommandEmpty>No SIL found.</CommandEmpty>
                                  <CommandGroup>
                                    {issuing.map((issued: StockIssuance) => (
                                      <CommandItem
                                        value={issued.stockIssuanceNo}
                                        key={issued._id}
                                        onSelect={() => {
                                          form.setValue(
                                            'stockIssuanceNo',
                                            issued._id
                                          );
                                          setSelectedIssuing(issued);
                                          // Automatically set other fields based on selected work order
                                          form.setValue(
                                            'dateIssued',
                                            issued.dateIssued || Date
                                          );
                                          // form.setValue(
                                          //   'department',
                                          //   issued.department?._id || ''
                                          // );
                                          form.setValue(
                                            'projects',
                                            issued.projects?._id || ''
                                          );
                                          form.setValue(
                                            'purpose',
                                            issued.purpose || ''
                                          );
                                          form.setValue(
                                            'requisitioner',
                                            issued.requisitioner._id || ''
                                          );

                                          form.setValue(
                                            'members',
                                            issued.members
                                              ? issued.members.map(
                                                  (member: any) => member._id
                                                )
                                              : []
                                          );

                                          form.setValue(
                                            'receivedBy',
                                            issued.receivedBy?._id || ''
                                          );
                                          form.setValue(
                                            'releasedBy',
                                            issued.releasedBy?._id || ''
                                          );
                                          form.setValue(
                                            'approvedBy',
                                            issued.approvedBy._id || ''
                                          );
                                          form.setValue(
                                            'remarks',
                                            issued.remarks || ''
                                          );
                                          form.setValue(
                                            `items.0.item`,
                                            issued.items?.itemCode || ''
                                          );
                                          // Automatically set items based on selected work order
                                          const updatedItems = issued.items.map(
                                            (item: IItemProps) => ({
                                              item: item.item._id, // Set the item's ID
                                              qtyOut: item.qtyOut, // Set the quantity in
                                            })
                                          );

                                          form.setValue('items', updatedItems);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            issued._id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {issued.stockIssuanceNo}
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
                    ></FormField>
                  </div>
                  <div className="">
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                        ></Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
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
              render={({ field }) => {
                const filteredUser = users.filter(
                  (user: IUserProps) => user.role === 'Inventory'
                );
                return (
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
                              ? filteredUser.find(
                                  (user: IUserProps) => user._id === field.value
                                )?.firstName +
                                ' ' +
                                filteredUser.find(
                                  (user: IUserProps) => user._id === field.value
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
                              {filteredUser.map((user: IUserProps) => (
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
                );
              }}
            />
            <FormField
              control={form.control}
              name="receivedBy"
              render={({ field }) => {
                const filteredUser = users.filter(
                  (user: IUserProps) => user.role === 'Crew'
                );
                return (
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
                              ? filteredUser.find(
                                  (user: IUserProps) => user._id === field.value
                                )?.firstName +
                                ' ' +
                                filteredUser.find(
                                  (user: IUserProps) => user._id === field.value
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
                              {filteredUser.map((user: IUserProps) => (
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
                );
              }}
            />
            <FormField
              control={form.control}
              name="approvedBy"
              render={({ field }) => {
                const filteredUser = users.filter(
                  (user: IUserProps) => user.role === 'Head'
                );
                return (
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
                              ? filteredUser.find(
                                  (user: IUserProps) => user._id === field.value
                                )?.firstName +
                                ' ' +
                                filteredUser.find(
                                  (user: IUserProps) => user._id === field.value
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
                              {filteredUser.map((user: IUserProps) => (
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
                );
              }}
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
