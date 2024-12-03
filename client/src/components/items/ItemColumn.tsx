import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { HistoryIcon, MoreHorizontal, Trash } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";
import ItemDeleteDialog from "./ItemDeleteDialog";
import ItemUpdateSheet from "./ItemUpdateSheet";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import ItemHistory from "./ItemHistory";
import { ColumnDef } from "@tanstack/react-table";
import { Items } from "@/types/ItemTypes";

export const itemColumns: ColumnDef<Items>[] = [
  {
    accessorKey: "itemCode",
    header: "Item Code",
    cell: ({ row }) => <div>{row.getValue("itemCode")}</div>,
  },
  {
    accessorKey: "itemDescription",
    header: "Item Description",
    cell: ({ row }) => <div>{row.getValue("itemDescription")}</div>,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <div>{row.getValue("unit")}</div>,
  },
  {
    accessorKey: "qtyIn",
    header: "Quantity In",
    cell: ({ row }) => <div>{row.getValue("qtyIn")}</div>,
  },
  {
    accessorKey: "qtyOut",
    header: "Quantity Out",
    cell: ({ row }) => <div>{row.getValue("qtyOut")}</div>,
  },
  {
    accessorKey: "stockOnHand",
    header: "Stock On Hand",
    cell: ({ row }) => <div>{row.getValue("stockOnHand")}</div>,
  },
  {
    accessorKey: "toolLocator",
    header: "Tool Locator",
    cell: ({ row }) => <div>{row.getValue("toolLocator")}</div>,
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => <div>{row.getValue("remarks")}</div>,
  },
  {
    accessorKey: "project",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => <div>{row.original.project?.name}</div>,
    filterFn: "equals",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [showDeleteItem, setShowDeleteItem] = useState(false);
      const [showUpdateItem, setShowUpdateItem] = useState(false);
      const [selectedItemId, setSelectedItemId] = useState<string | any>();
      const [updateItemId, setUpdateItemId] = useState<string | any>();
      const [showHistoryDialog, setShowHistoryDialog] = useState(false);

      const handleShowHistory = () => {
        setSelectedItemId(row.original._id);
        setShowHistoryDialog(true);
      };

      const handleUpdateSheet = () => {
        setUpdateItemId(row.original._id);
        setShowUpdateItem(true);
      };

      return (
        <>
          {selectedItemId && (
            <ItemHistory
              open={showHistoryDialog}
              onOpenChange={setShowHistoryDialog}
              itemId={selectedItemId}
            />
          )}

          {updateItemId && (
            <ItemUpdateSheet
              open={showUpdateItem}
              onOpenChange={setShowUpdateItem}
              itemId={updateItemId}
            />
          )}

          <ItemDeleteDialog
            open={showDeleteItem}
            onOpenChange={setShowDeleteItem}
            items={row.original}
            onSuccess={() => row.toggleSelected(false)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleShowHistory}>
                <HistoryIcon className="mr-2 h-4 w-4 text-sky-500" />
                History
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDeleteItem(true)}>
                <Trash className="mr-2 h-4 w-4 text-sky-500" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleUpdateSheet}>
                <UpdateIcon className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
