import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const { getSelf } = useAuthStore();

  const {} = useQuery({
    queryKey: ['self'],
    queryFn: () => getSelf(),
  });
  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* <div className="block z-50">
          <Sidebar />
        </div> */}
        <div className=" flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
