import { ComponentPropsWithoutRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useItemStore } from "@/store/userItemStore";
import { ItemLogEntry } from "@/interfaces/IItem";
import { DataTableSkeleton } from "../DataTableSkeleton";

interface ItemHistoryDialogProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  itemId: string;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ItemHistory({
  itemId,
  onOpenChange,
  open,
}: ItemHistoryDialogProps) {
  const { getItemHistory } = useItemStore();

  const { data: itemLogs = [], isFetching } = useQuery<any>({
    queryKey: ["getItemHistory", itemId],
    queryFn: () => getItemHistory(itemId),
    staleTime: 0, // Disables caching
    refetchOnMount: true,
  });
  const itemCode = itemLogs[0]?.itemId?.itemCode ?? "N/A";
  const itemDescription = itemLogs[0]?.itemId?.itemDescription ?? "N/A";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>{itemDescription}</DialogTitle>
          <DialogDescription>Item Code: {itemCode}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isFetching ? (
            <DataTableSkeleton columnCount={4} shrinkZero rowCount={5} />
          ) : (
            <div className="relative">
              <Table>
                <TableHeader>
                  <TableRow className="grid grid-cols-4">
                    <TableHead className="sticky top-0 bg-background z-10">
                      Action
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background z-10 text-end">
                      Quantity
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background z-10 text-end">
                      Current Stock
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background z-10 text-end">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <ScrollArea className="h-[300px] overflow-auto">
                <Table>
                  <TableBody>
                    {itemLogs.map((log: ItemLogEntry) => {
                      // Initialize values from log and changes
                      let stockOnHand = log.itemId?.stockOnHand;
                      let qtyIn = log.itemId?.qtyIn;
                      let qtyOut = log.itemId?.qtyOut; // Initialize qtyOut
                      let stockIssuanceNo = log.stockIssuanceNo;
                      let workOrderNo = log.workOrderNo;

                      // Parse changes if available
                      if (log.changes) {
                        try {
                          const parsedChanges = JSON.parse(log.changes);
                          stockOnHand =
                            parsedChanges.stockOnHand ?? stockOnHand;

                          // Adjust qtyIn or qtyOut based on action
                          if (log.action === "created") {
                            qtyIn = parsedChanges.qtyIn ?? qtyIn;
                          } else if (log.action === "issued") {
                            qtyOut = parsedChanges.qtyOut ?? qtyOut; // Handle qtyOut for issued action
                          }
                        } catch {
                          // Fallback in case of JSON parsing error
                          stockOnHand = "-";
                        }
                      }

                      return (
                        <TableRow key={log._id} className="grid grid-cols-4">
                          <TableCell className="text-sm capitalize">
                            {log.action} {stockIssuanceNo} {workOrderNo}
                          </TableCell>
                          <TableCell className="text-end">
                            {/* Display appropriate quantity based on action */}
                            {log.action === "created" && qtyIn}
                            {log.action === "received" && log.qtyReceived}
                            {log.action === "issued" && qtyOut}
                          </TableCell>
                          <TableCell className="text-end">
                            {stockOnHand}
                          </TableCell>
                          <TableCell className="text-end">
                            {new Date(log.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
