import { useState } from 'react';
import { DataTable } from '../DataTable';
import { useProjectStore } from '@/store/useProjectStore';
import { useQuery } from '@tanstack/react-query';
import { projectColumns } from './ProjectColumn';
import ProjectAdd from './ProjectAdd';
import { DataTableSkeleton } from '../DataTableSkeleton';
import { Input } from '../ui/Input';
import { IProjectProps } from '@/interfaces/IProject';

export default function ProjectDataTable() {
  const { getProjects } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: projects = [], isPending } = useQuery({
    queryKey: ['getProjects'],
    queryFn: () => getProjects(),
  });

  // Filter projects based on search term
  const filteredProjects = projects?.filter((project: IProjectProps) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {isPending ? (
        <DataTableSkeleton columnCount={3} rowCount={3} shrinkZero />
      ) : (
        <div>
          {/* Search Input */}

          <div className="flex justify-between mb-2">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-sm"
            />
            <ProjectAdd />
          </div>

          {/* DataTable with filtered projects */}
          <DataTable columns={projectColumns} data={filteredProjects || []} />
        </div>
      )}
    </div>
  );
}
