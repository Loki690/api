import ProjectDataTable from "@/components/projects/ProjectDataTable";

export default function Project() {
  return (
    <div className="container mx-auto py-10">
      <div>
        {" "}
        <h1 className="text-2xl font-bold mb-4">Project List</h1>
        <ProjectDataTable />
      </div>
    </div>
  );
}
