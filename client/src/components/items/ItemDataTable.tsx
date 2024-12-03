import { useItemStore } from "@/store/userItemStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { itemColumns } from "./ItemColumn";
import ItemAdd from "./ItemAdd";
import { DataTableSkeleton } from "../DataTableSkeleton";
import { Input } from "../ui/Input";
import { IItemProps } from "@/interfaces/IItem";
import { DataTableItem } from "../DataTableItem";
import { ItemPagination } from "./ItemPagination";

const ITEMS_PER_PAGE = 10;
export default function ItemDataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const { projectId } = useParams() as { projectId: string };
  const { getAllItems, currentPage, setCurrentPage } = useItemStore();
  const { data: itemsData = [], isPending } = useQuery<any>({
    queryKey: ["getAllItems"],
    queryFn: () => getAllItems(projectId),
  });

  const filteredItems = itemsData?.filter(
    (item: IItemProps) =>
      item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.project.name.toLowerCase().includes(searchTerm.toLowerCase)
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm, setCurrentPage]);

  return (
    <div>
      {isPending ? (
        <DataTableSkeleton columnCount={10} rowCount={10} shrinkZero />
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <Input
              placeholder="Search Item"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <ItemAdd />
          </div>
          <DataTableItem columns={itemColumns} data={paginatedItems || []} />
          <ItemPagination
            totalItems={filteredItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
