/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../DataTableColumnHeader';
import { StockIssuance } from '@/interfaces/IIssuing';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';

import IssuingDeleteDialog from './IssuingDeleteDialog';
import IssuingView from './IssuingView';

export const issuedItemColumns: ColumnDef<StockIssuance>[] = [
  {
    accessorKey: 'stockIssuanceNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SIL" />
    ),
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = useState(false);

      return (
        <>
          <div
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {row.original.stockIssuanceNo}
          </div>
          <IssuingView
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            issuance={row.original}
          />
        </>
      );
    },
  },

  {
    accessorKey: 'dateIssued',
    header: 'Date Issued',
    cell: ({ row }) => {
      const date = new Date(row.getValue('dateIssued'));
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'projects',
    header: 'Project Name',
    cell: ({ row }) => <div>{row.original.projects?.subprojectName}</div>,
  },
  {
    accessorKey: 'purpose',
    header: 'Purpose',
    cell: ({ row }) => <div>{row.original.purpose}</div>,
  },
  {
    accessorKey: 'remarks',
    header: 'Remark',
    cell: ({ row }) => <div>{row.original.remarks}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [showDeleteItem, setShowDeleteItem] = useState(false);

      return (
        <>
          <Button onClick={() => setShowDeleteItem(true)} variant="ghost">
            <Trash className="mr-2 h-4 w-4 text-sky-500" />
          </Button>
          <IssuingDeleteDialog
            open={showDeleteItem}
            onOpenChange={setShowDeleteItem}
            issuance={row.original}
          />
        </>
      );
    },
  },
];
