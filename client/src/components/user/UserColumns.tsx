import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, MoreHorizontal, Trash } from "lucide-react";

import { useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import UserDeleteDialog from "./UserDeleteDialog";
import UserUpdateDialog from "./UserUpdateDialog";
import { UpdateIcon } from "@radix-ui/react-icons";
import { User } from "@/types/UserTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { updateUserProjects } from "@/services/AddUserService";
import { useNavigate } from "react-router-dom";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => (
      <Avatar>
        <AvatarFallback>
          {row.original.firstName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "userCode",
    header: "Employee Code",
    cell: ({ row }) => <div>{row.getValue("userCode")}</div>,
  },
  {
    accessorKey: "firstName",
    header: "Firstname",
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: "Lastname",
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const roleMapping: Record<string, string> = {
        Admin: "Admin",
        Head: "Department Head",
        Inventory: "Inventory Officer",
        Crew: "Crew",
      };

      const roleValue = row.getValue("role") as string;
      return <div>{roleMapping[roleValue] || "Unknown Role"}</div>;
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => <div>{row.original.project?.name}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [showDeleteUser, setShowDeleteUser] = useState(false);
      const [showUpdateUser, setShowUpdateUser] = useState(false);
      const queryClient = useQueryClient();
      const { getProjects } = useUserStore();
      const navigate = useNavigate();
      const { mutate: updateUserProject, isPending } = updateUserProjects();

      // Fetch projects
      const { data: projects = [] } = useQuery<any>({
        queryKey: ["getProjects"],
        queryFn: () => getProjects(),
      });

      const handleProjectChange = (newProjectId: string) => {
        updateUserProject(
          {
            userId: row.original._id, // Replace with the correct ID field for your user
            newProject: newProjectId,
          },
          {
            onSuccess: () => {
              // Update user list if necessary
              navigate("/loading", {
                state: { returnPath: location.pathname },
              });
            },
            onError: (error) => {
              console.error("Error updating project:", error);
            },
          }
        );
      };

      return (
        <>
          <UserDeleteDialog
            open={showDeleteUser}
            onOpenChange={setShowDeleteUser}
            users={row.original}
            onSuccess={() => row.toggleSelected(false)}
          />
          <UserUpdateDialog
            open={showUpdateUser}
            onOpenChange={setShowUpdateUser}
            users={row.original}
          />

          <div className="flex items-center space-x-2">
            {/* Primary Dropdown for Delete/Update */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setShowDeleteUser(true)}>
                  <Trash className="mr-2 h-4 w-4 text-red-700" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowUpdateUser(true)}>
                  <UpdateIcon className="mr-2 h-4 w-4" /> Update
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Separate Dropdown for Project Selection */}

            {row.original.role === "Admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <span>Change Project</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {projects.map((project: any) => (
                    <DropdownMenuItem
                      key={project._id} // Use the correct project ID field
                      onSelect={() => handleProjectChange(project._id)}
                    >
                      {isPending &&
                      row.original.project?._id === project._id ? (
                        <span>Updating...</span>
                      ) : (
                        project.name // Use the correct project name field
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </>
      );
    },
  },
];
