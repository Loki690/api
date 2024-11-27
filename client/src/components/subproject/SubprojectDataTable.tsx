import { ISubprojects } from "@/interfaces/ISubproject";
import { useSubprojects } from "@/store/useSubproject";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DataTableSkeleton } from "../DataTableSkeleton";
import { Input } from "../ui/Input";
import { DataTable } from "../DataTable";
import { subprojectColumns } from "./SubprojectColumn";
import SubprojectAdd from "./SubprojectAdd";

export default function SubprojectDataTable() {
  const { projectId } = useParams();
  const { getSubprojects } = useSubprojects();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: subprojects = [], isPending } = useQuery({
    queryKey: ["getSubprojects"],
    queryFn: () => getSubprojects(projectId),
  });
  const filteredSubproject = subprojects?.filter((subproject: ISubprojects) =>
    subproject.subprojectName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      {isPending ? (
        <DataTableSkeleton columnCount={3} rowCount={3} shrinkZero />
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-sm"
            />
            <SubprojectAdd />
          </div>
          <DataTable columns={subprojectColumns} data={filteredSubproject} />
        </div>
      )}
    </div>
  );
}
