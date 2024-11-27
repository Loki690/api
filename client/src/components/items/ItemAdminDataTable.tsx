import { useItemStore } from '@/store/userItemStore';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DataTableSkeleton } from '../DataTableSkeleton';
import { Input } from '../ui/Input';
import { DataTableItem } from '../DataTableItem';
import { ItemPagination } from './ItemPagination';
import { itemColumns } from './ItemColumn';
import { debounce } from '@/utility/debounce';
import { useParams } from 'react-router-dom';

export default function ItemAdminDataTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const { projectId } = useParams();
  const {
    getAllItems,
    setCurrentPage,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useItemStore();
  const { data: itemsData, isPending } = useQuery<any>({
    queryKey: ['getAllItems', searchTerm, currentPage, itemsPerPage],
    queryFn: () =>
      getAllItems(projectId, searchTerm, currentPage, itemsPerPage),
    placeholderData: keepPreviousData, // Keep old data during refetch
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update store state
  };

  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page
  };

  useEffect(() => {
    setCurrentPage(currentPage); // Sync currentPage from pagination
  }, [currentPage, setCurrentPage]);

  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setSearchTerm(localSearch); // Update store search term
      setCurrentPage(1); // Reset to first page on new search
    }, 300);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [localSearch, setSearchTerm, setCurrentPage]);

  return (
    <div>
      {isPending ? (
        <DataTableSkeleton columnCount={10} rowCount={10} shrinkZero />
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <Input
              placeholder="Search Item"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTableItem columns={itemColumns} data={itemsData?.items || []} />
          <ItemPagination
            totalItems={itemsData?.totalItems || 0}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      )}
    </div>
  );
}
