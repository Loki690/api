import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LoaderCircle, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSignOut } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { useNavigate, NavLink } from "react-router-dom";
import { sidenav } from "@/constant";
import { useProjectStore } from "@/store/useProjectStore";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const { getProjectsById } = useProjectStore();
  const { data: projects = [] } = useQuery<any>({
    queryKey: ["getProjectsById"],
    queryFn: () => getProjectsById(projectId),
  });
  const { signOut, user: currentUser } = useAuthStore();
  const { mutate: signOutUser, isPending } = useSignOut();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const projectId = currentUser?.project ? String(currentUser.project) : "";

  // Filter side navigation based on user role
  const filteredSidenav = sidenav.filter((item) => {
    const isAdmin = currentUser?.role === "Admin";
    const isHead = currentUser?.role === "Head";

    // Exclude specific pages for Head role
    if (
      isHead &&
      (item.title === "Options" ||
        item.title === "Projects" ||
        item.title === "Items")
    ) {
      return false;
    }

    if (isAdmin && item.title === "Items") {
      return false;
    }

    // Exclude specific pages for non-Admin and non-Head roles
    if (
      !isAdmin &&
      !isHead &&
      (item.title === "Users" ||
        item.title === "Projects" ||
        item.title === "Options" ||
        item.path === "/admin/items/:projectId")
    ) {
      return false;
    }

    return true;
  });

  const handleLogout = () => {
    signOutUser(undefined, {
      onSuccess: () => {
        signOut();
        navigate(`/`);
        toast({
          title: "Logout Successfully",
          description: "Redirected to login page",
        });
        localStorage.clear();
      },
    });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="backdrop-blur-lg border-b py-2 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h1 className="font-semibold text-xl">DLPC-Arkcons Inventory</h1>
            <h3>{projects?.name}</h3>
          </div>

          <button
            className="md:hidden p-2 text-primary"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-4">
            {filteredSidenav.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path.replace(":projectId", projectId)}
                  className={({ isActive }) =>
                    `flex gap-1 items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-white bg-sky-500"
                        : "hover:bg-muted"
                    }`
                  }
                >
                  {item.icons}
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User controls */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border border-gray-400"
              >
                <Avatar>
                  <AvatarFallback>
                    {currentUser?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {currentUser?.firstName} {currentUser?.lastName}
              </DropdownMenuLabel>
              <DropdownMenuItem disabled={isPending} onClick={handleLogout}>
                {isPending && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden" id="mobile-menu">
          <ul className="flex flex-col mt-4 space-y-2">
            {filteredSidenav.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path.replace(":projectId", projectId)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icons}
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
