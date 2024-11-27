import { IReceivingProps } from '@/interfaces/IReceiving';
import { useReceivedItem } from '@/store/useReceivedItem';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTableSkeleton } from '../DataTableSkeleton';
import { Input } from '../ui/Input';
import { DataTable } from '../DataTable';
import { receivedItemColumns } from './ReceivingColumn';

export default function ReceivingDataTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const { projectId } = useParams();
  const { getReceivedItem } = useReceivedItem();

  const { data: receivedItems = [], isPending } = useQuery<any>({
    queryKey: ['getReceivedItems'],
    queryFn: () => getReceivedItem(projectId),
  });

  const filteredItems = receivedItems?.filter((receivedItem: IReceivingProps) =>
    receivedItem.workOrderNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log(filteredItems);
  return (
    <div>
      {isPending ? (
        <DataTableSkeleton columnCount={5} shrinkZero />
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <Input
              placeholder="Search Item Code"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTable columns={receivedItemColumns} data={filteredItems || []} />
        </div>
      )}
    </div>
  );
}
