import DepartmentDataTable from "@/components/department/DepartmentDataTable";
import SubprojectDataTable from "@/components/subproject/SubprojectDataTable";

export default function Options() {
  return (
    <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Department List</h1>
        <DepartmentDataTable />
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Subproject List</h1>
        <SubprojectDataTable />
      </div>
    </div>
  );
}
