import { Subprojects } from "@/types/SubprojectTypes";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";
import SubprojectDeleteDialog from "./SubprojectDeleteDialog";
import SubprojectUpdateSheet from "./SubprojectUpdateSheet";
export const subprojectColumns: ColumnDef<Subprojects>[] = [
  {
    accessorKey: "subprojectName",
    header: "Subproject Name",
    cell: ({ row }) => <div>{row.getValue("subprojectName")}</div>,
  },
  {
    accessorKey: "subprojectDescription",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("subprojectDescription")}</div>,
  },
  {
    id: "action",
    cell: ({ row }) => {
      const [showDeleteSubproject, setShowDeleteSubproject] = useState(false);
      const [showUpdateSubproject, setShowUpdateSubproject] = useState(false);

      return (
        <>
          <SubprojectDeleteDialog
            open={showDeleteSubproject}
            onOpenChange={setShowDeleteSubproject}
            subprojects={row.original}
            onSuccess={() => row.toggleSelected(false)}
          />

          <SubprojectUpdateSheet
            open={showUpdateSubproject}
            onOpenChange={setShowUpdateSubproject}
            subprojects={row.original}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setShowDeleteSubproject(true)}>
                <Trash className="mr-2 h-4 w-4 text-red-700" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowUpdateSubproject(true)}>
                <UpdateIcon className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
