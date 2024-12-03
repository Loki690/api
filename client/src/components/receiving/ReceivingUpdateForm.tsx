import { receivingItemSchema } from '@/schema/receivingFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  IReceivingProps,
  UpdateReceivingItemProps,
} from '@/interfaces/IReceiving';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useEffect, useState } from 'react';
import { IUserProps } from '@/interfaces/IAuth';
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
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { IItemProps } from '@/interfaces/IItem';
import { Input } from '../ui/Input';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { updateReceivedItem } from '@/services/ReceivingService';
import { useParams } from 'react-router-dom';
import { useReceivedItem } from '@/store/useReceivedItem';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export default function ReceivingUpdateForm({
  users,
  receiving,
  items,
}: UpdateReceivingItemProps) {
  const form = useForm<z.infer<typeof receivingItemSchema>>({
    resolver: zodResolver(receivingItemSchema),
    defaultValues: {
      items: [{ item: '', qtyIn: 0 }],
      requistioner: '',
      receivedBy: '',
      dateReceived: receiving.dateReceived,
      workOrderNo: '',
      remarks: '',
    },
  });
  const { projectId } = useParams() as { projectId: string };
  const { reset } = form;

  useEffect(() => {
    if (receiving) {
      reset({
        items: [{ item: receiving._id, qtyIn: receiving.qtyIn }],
        requistioner: receiving.requistioner?._id || '',
        receivedBy: receiving.receivedBy?._id || '',
        dateReceived: receiving.dateReceived || Date,
        remarks: receiving.remarks || '',
      });
    }
  }, [receiving, reset]);
  function handleItemSelect(index: number, itemId: string) {
    form.setValue(`items.${index}.item`, itemId); // Update the form's itemId value
  }
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  const queryClient = useQueryClient();
  const [selectedReceiving, setSelectedReceiving] =
    useState<IReceivingProps | null>(null);

  const { mutate: receivedItemUpdate, isPending } =
    updateReceivedItem(projectId);
  const { updateReceivedItems } = useReceivedItem();
  function onSubmit(values: z.infer<typeof receivingItemSchema>) {
    const { workOrderNo, ...rest } = values;
    receivedItemUpdate(
      {
        receivedItemId: selectedReceiving?._id,
        receivedItemData: rest,
      },
      {
        onSuccess: (data) => {
          updateReceivedItems(data, workOrderNo);
          queryClient.invalidateQueries({ queryKey: ['getReceivedItems'] });
          toast({
            title: 'Item updated',
            description: 'Receiving updated successfully',
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
                <div className="grid grid-rows-4 items-center text-sm">
                  <p>Date Received </p>
                  <p>Requisitioner </p>
                  <p>Received By </p>
                  <p>Remark </p>
                </div>
              </div>
              <div className="flex-1 grid grid-rows-4 gap-2">
                <div className="">
                  <FormField
                    control={form.control}
                    name="dateReceived"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full md:w-1/2 pl-3 text-left font-normal',
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
                {/* Requistioner field */}
                <div className="">
                  <FormField
                    control={form.control}
                    name="requistioner"
                    render={({ field }) => {
                      const filteredUser = users.filter(
                        (user: IUserProps) => user.role === 'Crew'
                      );
                      return (
                        <FormItem className="flex flex-1 items-center">
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
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[320px] p-0">
                              <Command>
                                <CommandInput placeholder="Search User" />
                                <CommandList>
                                  <CommandEmpty>No User found.</CommandEmpty>
                                  <CommandGroup>
                                    {filteredUser.map((user: IUserProps) => (
                                      <CommandItem
                                        value={user.firstName}
                                        key={user._id}
                                        onSelect={() => {
                                          form.setValue(
                                            'requistioner',
                                            user._id
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            user._id === field.value
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
                    name="receivedBy"
                    render={({ field }) => {
                      const filteredUser = users.filter(
                        (user: IUserProps) => user.role === 'Inventory'
                      );

                      return (
                        <FormItem className="flex flex-1 items-center">
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
                                    : 'Select a user'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[320px] p-0">
                              <Command>
                                <CommandInput placeholder="Search User" />
                                <CommandList>
                                  <CommandEmpty>No User found.</CommandEmpty>
                                  <CommandGroup>
                                    {filteredUser.map((user: IUserProps) => (
                                      <CommandItem
                                        value={user.firstName}
                                        key={user._id}
                                        onSelect={() => {
                                          form.setValue('receivedBy', user._id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            user._id === field.value
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
                      <FormItem className="flex flex-1 items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <FormControl>
                          <Input {...field}></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex justify-end">
                <div className="grid grid-rows-4 items-center text-sm">
                  <p>Work Order No</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="frid grid-rows-1 md:grid-rows-4 items-center">
                  <FormField
                    control={form.control}
                    name="workOrderNo"
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
                                  ? receiving.find(
                                      (received: IReceivingProps) =>
                                        received._id === field.value
                                    )?.workOrderNo
                                  : 'Select a work order no.'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[350px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Work Order" />
                              <CommandList>
                                <CommandEmpty>No order found.</CommandEmpty>
                                <CommandGroup>
                                  {receiving.map(
                                    (received: IReceivingProps) => (
                                      <CommandItem
                                        value={received.workOrderNo}
                                        key={received._id}
                                        onSelect={() => {
                                          form.setValue(
                                            'workOrderNo',
                                            received._id
                                          );
                                          setSelectedReceiving(received);
                                          // Automatically set other fields based on selected work order
                                          form.setValue(
                                            'requistioner',
                                            received.requistioner?._id || ''
                                          );
                                          form.setValue(
                                            'receivedBy',
                                            received.receivedBy?._id || ''
                                          );
                                          form.setValue(
                                            'dateReceived',
                                            received.dateReceived || Date
                                          );
                                          form.setValue(
                                            'remarks',
                                            received.remarks || ''
                                          );
                                          form.setValue(
                                            `items.0.item`,
                                            received.items?.itemCode || ''
                                          );
                                          // Automatically set items based on selected work order
                                          const updatedItems =
                                            received.items.map(
                                              (item: IItemProps) => ({
                                                item: item.item._id, // Set the item's ID
                                                qtyIn: item.qtyIn, // Set the quantity in
                                              })
                                            );

                                          form.setValue('items', updatedItems);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            received._id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {received.workOrderNo}
                                      </CommandItem>
                                    )
                                  )}
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
                    <FormItem className="flex flex-col">
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
                  name={`items.${index}.qtyIn`}
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
                >
                  <Trash2Icon className="text-red-900 w-5 h-5" />
                </Button>
              </div>
            ))}
            <div>
              <Button
                type="button"
                onClick={() => append({ item: '', qtyIn: 0 })}
                className="flex gap-2 h-9 mt-5"
              >
                <PlusCircle className="w-4 h-4" />
                Add Item
              </Button>
            </div>
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
