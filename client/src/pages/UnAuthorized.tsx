import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UnAuthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(`/`); // Go back to previous page
      localStorage.clear();
    } else {
      navigate('/'); // Redirect to a default page if no previous page
      localStorage.clear();
    }
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1>You're not authorized</h1>
      <p>Sorry for the inconvenience</p>
      <Button onClick={handleGoBack}>Go back</Button>
    </div>
  );
};

export default UnAuthorized;
