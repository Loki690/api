import { useItemStore } from "@/store/userItemStore";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataTableItem } from "../DataTableItem";
import { itemColumns } from "./ItemColumn";
import { DataTableSkeleton } from "../DataTableSkeleton";
import { IItemProps } from "@/interfaces/IItem";
import { Input } from "../ui/Input";
import { ItemPagination } from "./ItemPagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import ItemAdd from "./ItemAdd";

const ITEMS_PER_PAGE = 10;

export default function ItemDataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { projectId } = useParams();
  const { getAllItems, currentPage, setCurrentPage } = useItemStore();
  const { data: items = [], isPending } = useQuery({
    queryKey: ["getAllItems"],
    queryFn: () => getAllItems(projectId),
  });

  const filteredItems = items?.filter(
    (item: IItemProps) =>
      (item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedProject || item.project?.name === selectedProject)
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (searchTerm || selectedProject) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedProject, setCurrentPage]);

  const uniqueProjects = Array.from(
    new Set(items.map((item: IItemProps) => item.project?.name))
  ).filter(Boolean);

  return (
    <div>
      {isPending ? (
        <DataTableSkeleton columnCount={10} rowCount={10} shrinkZero />
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search Item"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedProject || "Filter by Project"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedProject(null)}>
                    All Projects
                  </DropdownMenuItem>
                  {uniqueProjects.map((project) => (
                    <DropdownMenuItem
                      key={project}
                      onClick={() => setSelectedProject(project)}
                    >
                      {project}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
