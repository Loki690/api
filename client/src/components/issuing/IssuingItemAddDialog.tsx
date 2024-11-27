import { IItemProps } from '@/interfaces/IItem';
import { issuanceItemListChema } from '@/schema/issuingFormSchema';
import { useItemStore } from '@/store/userItemStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ComponentPropsWithRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
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
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Label } from '../ui/label';
import { Input } from '../ui/Input';
import { useIssuanceList } from '@/store/useIssuanceStore';
import { putIssuedItems } from '@/services/IssuanceService';
import { toast } from '@/hooks/use-toast';
import { IssuedItemsPut } from '@/interfaces/IIssuing';

interface UpdateReceivedItemSheetProps
  extends ComponentPropsWithRef<typeof Dialog> {
  issuedItems: IssuedItemsPut;
  isOpen: boolean;
  onClose: () => void;
}

export default function IssuingItemAddDialog({
  issuedItems,
  isOpen,
  onClose,
}: UpdateReceivedItemSheetProps) {
  const { getItem } = useItemStore();
  const queryClient = useQueryClient();
  const { projectId } = useParams() as { projectId: string };
  const [selectedItem, setSelectedItem] = useState<IItemProps | null>(null); // Track selected item
  const form = useForm<z.infer<typeof issuanceItemListChema>>({
    resolver: zodResolver(issuanceItemListChema),
    defaultValues: {
      items: [
        {
          item: '',
          qtyOut: 0,
        },
      ],
    },
  });

  function handleItemSelect(itemId: string) {
    const selected = items.find((item: IItemProps) => item._id === itemId);
    setSelectedItem(selected || null); // Set the selected item details
    form.setValue(`items.0.item`, itemId); // Update the form's itemId value
  }

  const { data: items = [] } = useQuery<IItemProps[] | any>({
    queryKey: ['getItems'],
    queryFn: () => getItem(projectId),
  });

  const { putIssuedItem } = useIssuanceList();
  const { mutate: issuingItem, isPending } = putIssuedItems(projectId);

  function onSubmit(values: z.infer<typeof issuanceItemListChema>) {
    issuingItem(
      { issuedItemId: issuedItems._id, issuedItemData: values },
      {
        onSuccess: (data) => {
          putIssuedItem(data, issuedItems._id);
          queryClient.invalidateQueries({
            queryKey: ['getIssuedItems'],
          });
          toast({
            title: 'Item issued',
            description: 'Item successfully issued',
          });
          onClose();
        },
        onError: (err) => {
          toast({ title: 'Error adding', description: `${err}` });
        },
      }
    );
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue an Item</DialogTitle>
            <DialogDescription>
              Make sure to input the correct information
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="items.0.item"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Item Code</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'flex-1 justify-between',
                                !field.value && 'text-muted-foreground '
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
                                    onSelect={() => handleItemSelect(item._id)}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        item._id ===
                                          form.getValues('items.0.item')
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
              </div>

              {selectedItem && (
                <div className="border rounded-lg p-2 grid grid-cols-4 items-center">
                  <div className="col-span-3">
                    <Label>{selectedItem.itemDescription}</Label>
                  </div>
                  <div className="flex justify-end">
                    <Label>Unit: {selectedItem.unit}</Label>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="items.0.qtyOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input {...field} type="number"></Input>
                    </FormControl>
                  </FormItem>
                )}
              />

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
        </DialogContent>
      </Dialog>
    </div>
  );
}
