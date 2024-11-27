// import React, { ComponentPropsWithRef, useEffect, useState } from 'react';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from '../ui/sheet';
// import { ReceivedItem } from '@/types/ReceivedItemTypes';
// import { useQueryClient } from '@tanstack/react-query';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { receivingItemSchema } from '@/schema/receivingFormSchema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useItems } from '@/store/userItemStore';
// import { useParams } from 'react-router-dom';
// import { useUsers } from '@/store/useUserStore';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '../ui/form';
// import { useReceivedItem } from '@/store/useReceivedItem';
// import { updateReceivedItem } from '@/services/ReceivingService';
// import { toast } from '@/hooks/use-toast';
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { Button } from '../ui/button';
// import { cn } from '@/lib/utils';
// import { IUserProps } from '@/interfaces/IAuth';
// import {
//   CalendarIcon,
//   Check,
//   ChevronsUpDown,
//   LoaderCircle,
// } from 'lucide-react';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '../ui/command';
// import { IItemProps } from '@/interfaces/IItem';
// import { Label } from '../ui/label';
// import { Calendar } from '../ui/calendar';
// import { Input } from '../ui/Input';
// import { format } from 'date-fns';

// interface UpdateReceivedItemSheetProps
//   extends ComponentPropsWithRef<typeof Sheet> {
//   receivedItems: ReceivedItem;
// }

// export default function ReceivingUpdateSheet({
//   receivedItems,
//   ...props
// }: UpdateReceivedItemSheetProps) {
//   const { projectId } = useParams() as { projectId: string };
//   const queryClient = useQueryClient();
//   const { data: items = [] } = useItems(projectId) as {
//     data?: IItemProps[];
//   };
//   const { data: users = [] } = useUsers(projectId) as {
//     data?: IUserProps[];
//   };
//   const [selectedItem, setSelectedItem] = useState<IItemProps | null>(null);
//   const form = useForm<z.infer<typeof receivingItemSchema>>({
//     resolver: zodResolver(receivingItemSchema),
//     defaultValues: {
//       item: '',
//       requistioner: '',
//       receivedBy: '',
//       qtyIn: 0,
//       dateReceived: new Date(),
//       workOrderNo: '',
//       remarks: '',
//     },
//   });

//   const { reset } = form; // Extract reset from form

//   useEffect(() => {
//     if (receivedItems) {
//       reset({
//         item: receivedItems.item?._id || '', // Use receivedItems.item._id if it's nested
//         requistioner: receivedItems.requistioner?._id || '',
//         receivedBy: receivedItems.receivedBy?._id || '',
//         qtyIn: receivedItems.qtyIn || 0,
//         dateReceived: receivedItems.dateReceived || null,
//         workOrderNo: receivedItems?.workOrderNo || '',
//         remarks: receivedItems?.remarks || '',
//       });
//       // Pre-select the item details if it's available
//       const preSelectedItem = items.find(
//         (item) => item._id === receivedItems.item?._id
//       );
//       setSelectedItem(preSelectedItem || null);
//     }
//   }, [receivedItems, reset, items]);

//   const { updateReceivedItems } = useReceivedItem();
//   const {
//     mutate: receivedItemUpdate,
//     isPending,
//     isError,
//   } = updateReceivedItem(projectId);

//   function handleItemSelect(itemId: string) {
//     const selected = items.find(
//       (item: IItemProps) => item._id === itemId || receivedItems._id === itemId
//     );
//     setSelectedItem(selected || null); // Set the selected item details
//     form.setValue('item', itemId); // Update the form's itemId value
//   }

//   function onSubmit(values: z.infer<typeof receivingItemSchema>) {
//     receivedItemUpdate(
//       { receivedItemId: receivedItems._id, receivedItemData: values },
//       {
//         onSuccess: (data) => {
//           updateReceivedItems(data, receivedItems._id);
//           queryClient.invalidateQueries({ queryKey: ['getReceivedItems'] });
//           toast({
//             title: 'Item updated',
//             description: 'Item updated successfully',
//           });
//           props.onOpenChange?.(false);
//         },
//         onError: (err) => {
//           toast({
//             title: `${err}`,
//           });
//         },
//       }
//     );
//   }

//   return (
//     <div>
//       <Sheet {...props}>
//         <SheetContent>
//           <SheetHeader>
//             <SheetTitle>Update Received Item</SheetTitle>
//             <SheetDescription>Update and save the changes</SheetDescription>
//           </SheetHeader>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="flex flex-col gap-2"
//             >
//               <FormField
//                 control={form.control}
//                 name="item"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Item Code</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             disabled
//                             variant="outline"
//                             role="combobox"
//                             className={cn(
//                               'flex-1 justify-between',
//                               !field.value && 'text-muted-foreground'
//                             )}
//                           >
//                             {field.value
//                               ? items.find((item) => item._id === field.value)
//                                   ?.itemCode
//                               : receivedItems?.item?.itemCode ||
//                                 'Select an item'}{' '}
//                             {/* Ensure proper fallback */}
//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-[335px] p-0">
//                         <Command>
//                           <CommandInput placeholder="Search Item..." />
//                           <CommandList>
//                             <CommandEmpty>No Item found.</CommandEmpty>
//                             <CommandGroup>
//                               {items.map((item: IItemProps) => (
//                                 <CommandItem
//                                   value={item.itemCode}
//                                   key={item._id}
//                                   onSelect={() => {
//                                     form.setValue('item', item._id); // Set form itemId to item._id
//                                     handleItemSelect(item._id); // Update selectedItem state
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       'mr-2 h-4 w-4',
//                                       item._id === form.getValues('item') // Compare item._id with the value set in form
//                                         ? 'opacity-100'
//                                         : 'opacity-0'
//                                     )}
//                                   />
//                                   {item.itemCode}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {selectedItem && (
//                 <div className="border rounded-lg p-2 grid grid-cols-4 items-center">
//                   <div className="col-span-3">
//                     <Label>{selectedItem.itemDescription}</Label>
//                   </div>
//                   <div className="flex justify-end">
//                     <Label>Unit: {selectedItem.unit}</Label>
//                   </div>
//                 </div>
//               )}
//               <FormField
//                 control={form.control}
//                 name="requistioner"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Requistioner</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant="outline"
//                             role="combobox"
//                             className={cn(
//                               'flex-1 justify-between',
//                               !field.value && 'text-muted-foreground'
//                             )}
//                           >
//                             {field.value
//                               ? users.find(
//                                   (requistioner) =>
//                                     requistioner._id === field.value
//                                 )?.firstName +
//                                 ' ' +
//                                 users.find(
//                                   (requistioner) =>
//                                     requistioner._id === field.value
//                                 )?.lastName
//                               : receivedItems?.requistioner?.firstName ||
//                                 'Select a user'}

//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-[335px] p-0">
//                         <Command>
//                           <CommandInput placeholder="Search User" />
//                           <CommandList>
//                             <CommandEmpty>No Item found.</CommandEmpty>
//                             <CommandGroup>
//                               {users.map((user: IUserProps) => (
//                                 <CommandItem
//                                   value={user.firstName}
//                                   key={user._id}
//                                   onSelect={() => {
//                                     form.setValue('requistioner', user._id); // Set form itemId to item._id
//                                     handleItemSelect(user._id); // Update selectedItem state
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       'mr-2 h-4 w-4',
//                                       user._id ===
//                                         form.getValues('requistioner') // Compare item._id with the value set in form
//                                         ? 'opacity-100'
//                                         : 'opacity-0'
//                                     )}
//                                   />
//                                   {user.firstName} {user.lastName}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="receivedBy"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Received By</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant="outline"
//                             role="combobox"
//                             className={cn(
//                               'flex-1 justify-between',
//                               !field.value && 'text-muted-foreground'
//                             )}
//                           >
//                             {field.value
//                               ? users.find(
//                                   (requistioner) =>
//                                     requistioner._id === field.value
//                                 )?.firstName +
//                                 ' ' +
//                                 users.find(
//                                   (requistioner) =>
//                                     requistioner._id === field.value
//                                 )?.lastName
//                               : receivedItems?.requistioner?.firstName ||
//                                 'Select a user'}

//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-[335px] p-0">
//                         <Command>
//                           <CommandInput placeholder="Search User" />
//                           <CommandList>
//                             <CommandEmpty>No Item found.</CommandEmpty>
//                             <CommandGroup>
//                               {users.map((user: IUserProps) => (
//                                 <CommandItem
//                                   value={user.firstName}
//                                   key={user._id}
//                                   onSelect={() => {
//                                     form.setValue('receivedBy', user._id); // Set form itemId to item._id
//                                     handleItemSelect(user._id); // Update selectedItem state
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       'mr-2 h-4 w-4',
//                                       user._id === form.getValues('receivedBy') // Compare item._id with the value set in form
//                                         ? 'opacity-100'
//                                         : 'opacity-0'
//                                     )}
//                                   />
//                                   {user.firstName}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="qtyIn"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Quantity In</FormLabel>
//                     <FormControl>
//                       <Input {...field} type="number"></Input>
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="dateReceived"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Date Received</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={'outline'}
//                             className={cn(
//                               'w-full pl-3 text-left font-normal',
//                               !field.value && 'text-muted-foreground'
//                             )}
//                           >
//                             {field.value ? (
//                               format(field.value, 'PPP')
//                             ) : (
//                               <span>Pick a date</span>
//                             )}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           disabled={(date) =>
//                             date > new Date() || date < new Date('1900-01-01')
//                           }
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="workOrderNo"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Work Order No.</FormLabel>
//                     <FormControl>
//                       <Input {...field}></Input>
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="remarks"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Remarks</FormLabel>
//                     <FormControl>
//                       <Input {...field}></Input>
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" disabled={isPending} className="mt-2">
//                 {isPending ? (
//                   <LoaderCircle
//                     className=" size-5 animate-spin"
//                     aria-hidden="true"
//                   />
//                 ) : (
//                   'Submit'
//                 )}
//               </Button>
//             </form>
//           </Form>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }
