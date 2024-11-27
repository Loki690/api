import { Departments } from "@/types/DepartmentTypes";
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
import DepartmentDeleteDialog from "./DepartmentDeleteDialog";
import DepartmentUpdateSheet from "./DepartmentUpdateSheet";

export const departmentColumns: ColumnDef<Departments>[] = [
  {
    accessorKey: "departmentName",
    header: "Department Name",
    cell: ({ row }) => <div>{row.getValue("departmentName")}</div>,
  },
  {
    accessorKey: "departmentDescription",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("departmentDescription")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDepartment, setShowDeleteDepartment] = useState(false);
      const [showUpdateDepartment, setShowUpdateDepartment] = useState(false);

      return (
        <>
          <DepartmentDeleteDialog
            open={showDeleteDepartment}
            onOpenChange={setShowDeleteDepartment}
            departments={row.original}
            onSuccess={() => row.toggleSelected(false)}
          />

          <DepartmentUpdateSheet
            open={showUpdateDepartment}
            onOpenChange={setShowUpdateDepartment}
            departments={row.original}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setShowDeleteDepartment(true)}>
                <Trash className="mr-2 h-4 w-4 text-red-700" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowUpdateDepartment(true)}>
                <UpdateIcon className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
