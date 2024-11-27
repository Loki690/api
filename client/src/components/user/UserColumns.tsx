import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import UserDeleteDialog from './UserDeleteDialog';
import UserUpdateDialog from './UserUpdateDialog';
import { UpdateIcon } from '@radix-ui/react-icons';
import { User } from '@/types/UserTypes';

export const userColumns: ColumnDef<User>[] = [
  {
    id: 'avatar',
    header: '',
    cell: ({ row }) => (
      <Avatar>
        <AvatarFallback>
          {row.original.firstName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'userCode',
    header: 'Employee Code',
    cell: ({ row }) => <div>{row.getValue('userCode')}</div>,
  },
  {
    accessorKey: 'firstName',
    header: 'Firstname',
    cell: ({ row }) => <div>{row.getValue('firstName')}</div>,
  },
  {
    accessorKey: 'lastName',
    header: 'Lastname',
    cell: ({ row }) => <div>{row.getValue('lastName')}</div>,
  },
  {
    accessorKey: 'isAdmin',
    header: 'Role',
    cell: ({ row }) => <div>{row.getValue('isAdmin') ? 'Admin' : 'User'}</div>, // Optional formatting
  },
  {
    accessorKey: 'project',
    header: 'Project',
    cell: ({ row }) => <div>{row.original.project?.name}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const [showDeleteUser, setShowDeleteUser] = useState(false);
      const [showUpdateUser, setShowUpdateUser] = useState(false);

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
        </>
      );
    },
  },
];
