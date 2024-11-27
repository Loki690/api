import { ComponentPropsWithRef, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { IReceivingProps } from '@/interfaces/IReceiving';
import { format } from 'date-fns';

interface ReceivingViewProps extends ComponentPropsWithRef<typeof Dialog> {
  received: IReceivingProps;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceivingView({
  received,
  isOpen,
  onClose,
}: ReceivingViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Receiving View</DialogTitle>
            <DialogDescription>
              Make sure to check the information before print
            </DialogDescription>
          </DialogHeader>

          <div ref={contentRef}>
            <div className="grid grid-cols-2 md:grid-cols-2">
              <div>
                <p>
                  Requisitioner:{' '}
                  {`${received.requistioner.firstName} ${received.requistioner.lastName}`}
                </p>
                <p>
                  Received By:{' '}
                  {`${received.receivedBy.firstName} ${received.receivedBy.lastName}`}
                </p>
                <p>Remarks: {received.remarks}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{received.workOrderNo}</p>
                <p>{format(new Date(received.dateReceived), 'MMM dd, yyyy')}</p>
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
                  {received.items && received.items.length > 0 ? (
                    received.items.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.item?.itemCode}</TableCell>
                        <TableCell>{item.item?.itemDescription}</TableCell>
                        <TableCell className="text-center">
                          {item.qtyIn}
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
