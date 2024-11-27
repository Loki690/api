import { sidenav } from '@/constant';
import { NavLink } from 'react-router-dom';
import SidebarList from './ui/SidebarList';
import { useAuthStore } from '@/store/useAuthStore';

export default function Sidebar() {
  const { user: currentUser } = useAuthStore();
  const projectId = currentUser?.project ? String(currentUser.project) : '';

  const filteredSidenav = sidenav.filter((item) => {
    if (
      !currentUser?.isAdmin &&
      (item.title === 'Users' ||
        item.title === 'Projects' ||
        item.title === 'Options' ||
        item.path === 'Items-Admin')
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="sidebar fixed z-10 backdrop-blur-lg">
      <div className="flex overflow-hidden py-2 px-2 border h-full">
        <ul className="navbar-nav">
          {filteredSidenav.map((item) => (
            <li className="nav-item cursor-pointer" key={item.id}>
              {item.path ? (
                <NavLink
                  to={item.path.replace(':projectId', projectId || '')} // Replace with the actual projectId
                  className="rounded-md"
                  // NavLink's isActive prop helps to determine if the route is active
                  children={({ isActive }) => (
                    <SidebarList isActive={isActive}>
                      <p>{item.icons}</p>
                      <span className="link-text">{item.title}</span>
                    </SidebarList>
                  )}
                />
              ) : (
                <div className="nav-item-disabled">
                  <SidebarList className="text-gray-400">
                    <p>{item.icons}</p>
                    <span className="link-text">{item.title}</span>
                  </SidebarList>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
