import { StockIssuance } from '@/interfaces/IIssuing'; // Adjust the import based on your project structure
import { useReactToPrint } from 'react-to-print';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { PlusCircle, PrinterIcon, Trash2 } from 'lucide-react';
import IssuingItemAddDialog from './IssuingItemAddDialog';
import { useRef, useState } from 'react';
import IssuedItemDeleteDialog from './IssuedItemDeleteDialog';

interface IssuingDetailsProps {
  issuance: StockIssuance | any; // Accepting the issuance object or null
}

export default function IssuingDetails({ issuance }: IssuingDetailsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // State for selected item ID

  if (!issuance) return null; // Don't render anything if no issuance is selected

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  const handleDelete = (itemId: string, issuance: any) => {
    // Ensure you pass the right issuanceId
    handleDelete(itemId, issuance._id);
  };

  return (
    <div className="flex flex-col gap-2" ref={contentRef}>
      <div className="grid grid-cols-1 md:grid-cols-3 justify-between gap-2">
        <div className="col-span-2 p-2">
          <p>
            Date Issued:{' '}
            {new Date(issuance.dateIssued).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p>Department: {issuance.department}</p>
          <p>Project: {issuance.projects}</p>
          <p>Purpose: {issuance.purpose}</p>
          <div>
            Requisitioner:{' '}
            {issuance.requisitioner ? (
              <span>
                {issuance.requisitioner.firstName}{' '}
                {issuance.requisitioner.lastName}
              </span>
            ) : (
              <span>No requisitioner</span>
            )}
          </div>
          <div>
            Members:
            {issuance.members && issuance.members.length > 0 ? (
              <span>
                {issuance.members.map((member: any) => (
                  <span key={member._id}>
                    {' '}
                    {member.firstName} {member.lastName},
                  </span>
                ))}
              </span>
            ) : (
              <span>No members assigned.</span>
            )}
          </div>
          <p>Remark: {issuance.remarks}</p>
        </div>
        <div className="col-span-1">
          <p className="text-right p-2">SIL No: {issuance.stockIssuanceNo}</p>
        </div>
      </div>
      <div className="border rounded">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="text-right">Remarks</TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issuance.items && issuance.items.length > 0 ? (
              issuance.items.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell>{item.item.itemCode}</TableCell>
                  <TableCell>{item.item.itemDescription}</TableCell>
                  <TableCell className="text-center">{item.qtyOut}</TableCell>
                  <TableCell className="text-right">{item.item.unit}</TableCell>
                  <TableCell className="text-right">
                    {item.item.remarks}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItemId(item._id); // Set the selected item ID
                        setDeleteOpen(true); // Open the delete dialog
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-sky-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No issued items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <IssuedItemDeleteDialog
        itemId={selectedItemId} // Pass the selected item ID to the delete dialog
        issuanceId={issuance._id} // Pass the issuance ID to the delete dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add Item
        </Button>
        <Button size="sm" className="gap-1" onClick={() => reactToPrintFn()}>
          <PrinterIcon className="h-4 w-4" />
          Print
        </Button>

        <IssuingItemAddDialog
          issuedItems={issuance}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      <div className="flex justify-evenly mt-4">
        <div className="text-center">
          <p className="mb-2">Received By</p>
          <span>
            {issuance.receivedBy.firstName} {issuance.receivedBy.lastName}
          </span>
        </div>
        <div className="text-center">
          <p className="mb-2">Released By</p>
          <span>
            {issuance.releasedBy.firstName} {issuance.releasedBy.lastName}
          </span>
        </div>
        <div className="text-center">
          <p className="mb-2">Verified and Approved By</p>
          <span>
            {issuance.approvedBy.firstName} {issuance.approvedBy.lastName}
          </span>
        </div>
      </div>
    </div>
  );
}
