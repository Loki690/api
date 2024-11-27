// IssuanceDataTable.js
import { useIssuanceList } from "@/store/useIssuanceStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DataTableSkeleton } from "../DataTableSkeleton";
import { Input } from "../ui/Input";
import { StockIssuance } from "@/interfaces/IIssuing";
import { DataTable } from "../DataTable";
import { issuedItemColumns } from "./IssuanceColumn";

export default function IssuanceDataTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const { projectId } = useParams();
  const { getIssuedItem } = useIssuanceList();

  const { data: issuedItems = [], isPending } = useQuery({
    queryKey: ["getIssuedItems"],
    queryFn: () => getIssuedItem(projectId),
  });

  const filteredItems = issuedItems?.filter((issuedItem: StockIssuance) =>
    issuedItem.stockIssuanceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="">
      {isPending ? (
        <DataTableSkeleton columnCount={5} shrinkZero />
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <Input
              placeholder="Search SIL"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-sm"
            />
          </div>

          <DataTable columns={issuedItemColumns} data={filteredItems || []} />
        </div>
      )}
    </div>
  );
}
