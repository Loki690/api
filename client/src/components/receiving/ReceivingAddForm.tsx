/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/hooks/use-toast';
import { IItemProps } from '@/interfaces/IItem';
import { receivingItemSchema } from '@/schema/receivingFormSchema';
import { addReceivedItems } from '@/services/ReceivingService';
import { useReceivedItem } from '@/store/useReceivedItem';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  LoaderCircle,
  PlusCircle,
  Trash2Icon,
} from 'lucide-react';
import { format } from 'date-fns';
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
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { IUserProps } from '@/interfaces/IAuth';
import { Input } from '../ui/Input';
import { Calendar } from '../ui/calendar';
import { UpdateReceivingItemProps } from '@/interfaces/IReceiving';

export default function ReceivingAddForm({
  users,
  items,
}: UpdateReceivingItemProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const { addReceivedItem } = useReceivedItem();

  const { mutate: receivingItem, isPending } = addReceivedItems(projectId);
  const form = useForm<z.infer<typeof receivingItemSchema>>({
    resolver: zodResolver(receivingItemSchema),
    defaultValues: {
      items: [{ item: '', qtyIn: 0 }],
      requistioner: '',
      receivedBy: '',
      dateReceived: new Date(),
      workOrderNo: '',
      remarks: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  function handleItemSelect(index: number, itemId: string) {
    form.setValue(`items.${index}.item`, itemId); // Update the form's itemId value
  }

  function handleRequistionerSelect(itemId: string) {
    form.setValue('requistioner', itemId); // Update the form's itemId value
  }
  function handleUserSelect(itemId: string) {
    form.setValue('receivedBy', itemId); // Update the form's itemId value
  }

  function onSubmit(values: z.infer<typeof receivingItemSchema>) {
    receivingItem(values, {
      onSuccess: (data) => {
        addReceivedItem(data, projectId);
        queryClient.invalidateQueries({ queryKey: ['getReceivedItems'] });
        queryClient.invalidateQueries({
          queryKey: ['getReceivedItemsSelection'],
        });
        toast({
          title: 'Item added',
          description: 'Item successfully received',
        });
        form.reset({
          ...values,
        });
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
                            <FormControl className="justify-end flex">
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
                <div className="">
                  <FormField
                    control={form.control}
                    name="requistioner"
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
                                    'w-full md:w-1/2  justify-between',
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
                                    : 'Select Requistioner'}
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
                                          ); // Set form itemId to user._id
                                          handleRequistionerSelect(user._id); // Update selectedItem state
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            user._id ===
                                              form.getValues('requistioner') // Compare user._id with the value set in form
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
                        <FormItem className="flex items-center">
                          <FormLabel className="mr-2">:</FormLabel>
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
                                        (user: IUserProps) =>
                                          user._id === field.value
                                      )?.firstName +
                                      ' ' +
                                      filteredUser.find(
                                        (user: IUserProps) =>
                                          user._id === field.value
                                      )?.lastName
                                    : 'Received by'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[320px] p-0">
                              <Command>
                                <CommandInput placeholder="Search User" />
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
                                          form.setValue('receivedBy', user._id); // Set form itemId to item._id
                                          handleUserSelect(user._id); // Update selectedItem state
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            user._id ===
                                              form.getValues('receivedBy') // Compare item._id with the value set in form
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
                          <Input
                            {...field}
                            className="w-full md:w-1/2 m-0"
                          ></Input>
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
                <div className="grid grid-rows-1 md:grid-rows-4 items-center">
                  {' '}
                  <FormField
                    control={form.control}
                    name="workOrderNo"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 items-center">
                        <FormLabel className="mr-2">:</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full "></Input>
                        </FormControl>
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
                            className="text-center"
                            {...field}
                            value={selectedItem?.unit || ''}
                            readOnly
                            placeholder="Unit"
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
