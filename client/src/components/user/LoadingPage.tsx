import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.returnPath || "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(returnPath, { replace: true });
      // Add a small delay before reloading to ensure navigation is complete
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, [navigate, returnPath]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
