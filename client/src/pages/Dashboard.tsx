import { useProjectStore } from '@/store/useProjectStore';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export default function Dashboard() {
  const { projectId } = useParams() as { projectId: string };
  const { getProjectsById } = useProjectStore();
  const { data: projects = [] } = useQuery<any>({
    queryKey: ['getProjectsById'],
    queryFn: () => getProjectsById(projectId),
  });
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            fill="rgba(59, 130, 246, 0.1)"
            fillOpacity="1"
            d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <h2>Welcome to</h2>
          <h1 className="text-4xl md:text-6xl font-bold text-center px-4 py-8 ">
            {projects.name || 'Project Name Not Available'}
          </h1>
        </div>
      </div>
    </div>
  );
}
