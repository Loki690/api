import { ComponentPropsWithRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateItemFormSchema } from "@/schema/itemFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateItem } from "@/services/ItemService";
import { useParams } from "react-router-dom";

import { useItemStore } from "@/store/userItemStore";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

interface UpdateItemSheetProps extends ComponentPropsWithRef<typeof Sheet> {
  itemId: string;
}

import { useEffect } from "react";

export default function ItemUpdateSheet({
  itemId,
  ...props
}: UpdateItemSheetProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();

  //uncomment if want to use fetching item details by its id
  const { getItemById } = useItemStore();
  const { data: items, isFetching } = useQuery<any>({
    queryKey: ["getItemById", itemId],
    queryFn: () => getItemById(itemId),
    staleTime: 0,
    refetchOnMount: true,
  });
  const form = useForm<z.infer<typeof updateItemFormSchema>>({
    resolver: zodResolver(updateItemFormSchema),
    defaultValues: {
      itemCode: "",
      itemDescription: "",
      unit: "",
      qtyIn: 0,
      qtyOut: 0,
      stockOnHand: 0,
      toolLocator: "",
      remarks: "",
    },
  });

  const { reset } = form;

  // Reset form values when `items` is fetched
  useEffect(() => {
    if (items) {
      reset({
        itemCode: items.itemCode,
        itemDescription: items.itemDescription,
        unit: items.unit,
        qtyIn: items.qtyIn,
        qtyOut: items.qtyOut,
        stockOnHand: items.stockOnHand,
        toolLocator: items.toolLocator,
        remarks: items.remarks,
      });
    }
  }, [items, reset]);

  const { updateItems } = useItemStore();

  const { mutate: itemUpdate, isPending } = updateItem(projectId);

  function onSubmit(values: z.infer<typeof updateItemFormSchema>) {
    itemUpdate(
      { itemId: items._id, itemData: values },
      {
        onSuccess: (data) => {
          updateItems(data, items._id);
          queryClient.invalidateQueries({ queryKey: ["getItems"] });
          queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
          queryClient.invalidateQueries({ queryKey: ["getItemById"] });
          toast({
            title: "Item updated",
            description: "Item updated successfully",
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
            <SheetTitle>Update Item</SheetTitle>
            <SheetDescription>
              Update the Item details and save the changes
            </SheetDescription>
          </SheetHeader>
          {isFetching ? (
            <div className="flex justify-center items-center h-full">
              <LoaderCircle className="icon-size-5 animate-spin" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={form.control}
                  name="itemCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Code</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="itemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Description</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="qtyIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity In</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="qtyOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Out</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="stockOnHand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock On Hand</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="toolLocator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Locator</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <Button className="mt-4" type="submit" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle className="icon-size-5 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
