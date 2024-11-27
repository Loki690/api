import { Projects } from "@/types/ProjectTypes";
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
import ProjectDeleteDialog from "./ProjectDeleteDialog";
import ProjectUpdateSheet from "./ProjectUpdateSheet";

export const projectColumns: ColumnDef<Projects>[] = [
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Project Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "prefix",
    header: "Prefix",
    cell: ({ row }) => <div>{row.getValue("prefix")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [showDeleteProject, setShowDeleteProject] = useState(false);
      const [showUpdateProject, setShowUpdateProject] = useState(false);

      return (
        <>
          <ProjectDeleteDialog
            open={showDeleteProject}
            onOpenChange={setShowDeleteProject}
            projects={row.original}
            onSuccess={() => row.toggleSelected(false)}
          />

          <ProjectUpdateSheet
            open={showUpdateProject}
            onOpenChange={setShowUpdateProject}
            projects={row.original}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setShowDeleteProject(true)}>
                <Trash className="mr-2 h-4 w-4 text-red-700" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowUpdateProject(true)}>
                <UpdateIcon className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
