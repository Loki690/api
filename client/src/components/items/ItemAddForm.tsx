import { FormModalProps } from "@/interfaces/IItem";
import { useItemStore } from "@/store/userItemStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useParams } from "react-router-dom";
import { itemFormSchema } from "@/schema/itemFormSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/Input";
import { addItems } from "@/services/ItemService";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import ItemUpload from "./ItemUpload";

export default function ItemAddForm({ isOpen, onClose }: FormModalProps) {
  const { projectId } = useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const { addItem } = useItemStore();

  const { mutate: itemAdd, isPending } = addItems(projectId);

  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      itemCode: "",
      itemDescription: "",
      unit: "",
      qtyIn: 0,
      qtyOut: 0,
      stockOnHand: 0,
      toolLocator: "",
      remarks: "",
      project: "",
    },
  });

  function onSubmit(values: z.infer<typeof itemFormSchema>) {
    console.log(values);
    itemAdd(values, {
      onSuccess: (data) => {
        addItem(data, projectId);
        queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
        toast({ title: "Item added", description: "Item successfully added" });
        onClose();
      },
      onError: (err) => {
        toast({ title: "Error adding", description: `${err}` });
      },
    });
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Make sure to input the correct information
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="itemCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="itemDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="qtyIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity In</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="qtyOut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity Out</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="stockOnHand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock On Hand</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="toolLocator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tool Locator</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isPending} className="mt-4">
                  {isPending ? (
                    <LoaderCircle
                      className="size-5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>

            <div className="my-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>
            </div>

            <ItemUpload projectId={projectId} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
