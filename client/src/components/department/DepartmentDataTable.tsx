import { IDepartments } from "@/interfaces/IDepartment";
import { useDepartments } from "@/store/useDepartmentStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DataTableSkeleton } from "../DataTableSkeleton";
import { Input } from "../ui/Input";
import { DataTable } from "../DataTable";
import { departmentColumns } from "./DepartmentColumn";
import DepartmentAdd from "./DepartmentAdd";

export default function DepartmentDataTable() {
  const { projectId } = useParams();
  const { getDepartments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: departments = [], isPending } = useQuery({
    queryKey: ["getDepartments"],
    queryFn: () => getDepartments(projectId),
  });

  const filteredDepartments = departments?.filter((department: IDepartments) =>
    department.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
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
            <DepartmentAdd />
          </div>
          <DataTable columns={departmentColumns} data={filteredDepartments} />
        </div>
      )}
    </div>
  );
}
