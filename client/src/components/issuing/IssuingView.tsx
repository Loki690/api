import { ComponentPropsWithRef, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { StockIssuance } from '@/interfaces/IIssuing';
import { format } from 'date-fns';
import { IUserProps } from '@/interfaces/IAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';

interface IssuanceViewProps extends ComponentPropsWithRef<typeof Dialog> {
  issuance: StockIssuance;
  isOpen: boolean;
  onClose: () => void;
}

export default function IssuingView({
  issuance,
  isOpen,
  onClose,
}: IssuanceViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Issuance_${issuance.stockIssuanceNo}`,
    pageStyle: `
    @media print {
      @page {
        margin: 20mm; /* Add margin to the printed page */
      }
      body {
        padding: 20px; /* Optional: Add padding to body for inner spacing */
      }
      .printable-content {
        padding: 20px; /* Additional padding inside the content itself */
      }
    }
  `,
  });

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Issuance view</DialogTitle>
            <DialogDescription>
              Make sure to check the information before printing
            </DialogDescription>
          </DialogHeader>

          <div ref={contentRef}>
            <div className="grid grid-cols-2 md:grid-cols-2">
              <div>
                <p>Project: {issuance.projects?.subprojectName}</p>
                <p>Purpose: {issuance.purpose}</p>
                <p>
                  Requisitioner:{' '}
                  {`${issuance.requisitioner.firstName} ${issuance.requisitioner.lastName}`}
                </p>
                <p>
                  Members:{' '}
                  {issuance.members.map((member: IUserProps) => (
                    <span key={member._id}>
                      {`${member.firstName} ${member.lastName}`},{' '}
                    </span>
                  ))}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{issuance.stockIssuanceNo}</p>
                <p>{format(new Date(issuance.dateIssued), 'MMMM dd, yyyy')}</p>
              </div>
            </div>

            <div className="border rounded-lg mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuance.items && issuance.items.length > 0 ? (
                    issuance.items.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.item?.itemCode}</TableCell>
                        <TableCell>{item.item?.itemDescription}</TableCell>
                        <TableCell className="text-center">
                          {item.qtyOut}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.item?.unit}
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

            <div className="flex justify-evenly mt-10">
              <div className="text-center">
                <p className="mb-2">Received By</p>
                <span>
                  {issuance.receivedBy?.firstName}{' '}
                  {issuance.receivedBy?.lastName}
                </span>
              </div>
              <div className="text-center">
                <p className="mb-2">Released By</p>
                <span>
                  {issuance.releasedBy?.firstName}{' '}
                  {issuance.releasedBy?.lastName}
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

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => handlePrint()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
