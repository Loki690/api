import { ReceivedItem } from "@/types/ReceivedItemTypes";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import ReceivingDeleteDialog from "./ReceivingDeleteDialog";

import ReceivingView from "./ReceivingView";

export const receivedItemColumns: ColumnDef<ReceivedItem>[] = [
  {
    accessorKey: "workOrderNo",
    header: "Worker Order No.",
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      return (
        <>
          <div
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {row.original.workOrderNo}
          </div>
          <ReceivingView
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            received={row.original}
          />
        </>
      );
    },
  },
  {
    accessorKey: "requistioner",
    header: "Requisitioner",
    cell: ({ row }) => (
      <div>
        {row.original.requistioner?.firstName}{" "}
        {row.original.requistioner?.lastName}{" "}
      </div>
    ),
  },
  {
    accessorKey: "receivedBy",
    header: "Received By",
    cell: ({ row }) => (
      <div>
        {row.original.receivedBy?.firstName} {row.original.receivedBy?.lastName}
      </div>
    ),
  },
  {
    accessorKey: "dateReceived",
    header: "Date Received",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateReceived")); // Convert the value to a Date object
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long", // You can use 'short' or 'numeric' for different formats
        day: "numeric",
      });
      return <div>{formattedDate}</div>;
    },
  },

  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => <div>{row.getValue("remarks")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [showDeleteItem, setShowDeleteItem] = useState(false);

      return (
        <>
          <Button onClick={() => setShowDeleteItem(true)} variant="ghost">
            <Trash className="mr-2 h-4 w-4 text-sky-500" />
          </Button>
          <ReceivingDeleteDialog
            open={showDeleteItem}
            onOpenChange={setShowDeleteItem}
            receivedItems={row.original}
          />
          {/* <ReceivingView
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            received={row.original}
          /> */}
          {/* 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
                <EyeIcon className="mr-2 h-4 w-4 text-sky-500" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDeleteItem(true)}>
                <Trash className="mr-2 h-4 w-4 text-sky-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </>
      );
    },
  },
];
