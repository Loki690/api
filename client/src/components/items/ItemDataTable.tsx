import { useItemStore } from "@/store/userItemStore";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataTableItem } from "../DataTableItem";
import { itemColumns } from "./ItemColumn";
import ItemAdd from "./ItemAdd";
import { DataTableSkeleton } from "../DataTableSkeleton";
import { Input } from "../ui/Input";
import { debounce } from "@/utility/debounce";
import { ItemPagination } from "./ItemPagination";

export default function ItemDataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const { projectId } = useParams() as { projectId: string };
  const {
    getAllItems,
    setCurrentPage,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useItemStore();
  const { data: itemsData = [], isPending } = useQuery<any>({
    queryKey: ["getItems", searchTerm, currentPage, itemsPerPage],
    queryFn: () =>
      getAllItems(projectId, searchTerm, currentPage, itemsPerPage),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(currentPage);
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
            <ItemAdd />
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
