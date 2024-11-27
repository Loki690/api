import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/useAuthStore';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useSignIn } from '@/services/authService';
import { LoaderCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

const SigninForm: React.FC = () => {
  const [formData, setFormData] = useState({ userCode: '', password: '' });
  const navigate = useNavigate();

  const { signIn } = useAuthStore();
  const { mutate: signInUser, isPending } = useSignIn();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.userCode || !formData.password) {
      toast({ title: 'Warning!', description: 'Please fill up the fields' });
      return;
    }

    signInUser(formData, {
      onSuccess: (data) => {
        signIn(data);
        // Check if the user is an admin
        if (data.isAdmin) {
          navigate('/admin/items');
          toast({
            title: 'Admin Login Successful',
            description: 'Redirected to Admin Dashboard',
          });
        } else {
          navigate(`/items/${data.project}`);
          toast({
            title: 'Login Successfully',
            description: 'Redirected to project',
          });
        }
      },
      onError: (error) => {
        toast({ title: error.message, description: 'Please try again!' });
      },
    });
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Make sure to provide the correct data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* {errorMessage && (
                    <p className="font-bold bg-red-200/30 text-red-900">
                      {errorMessage}
                    </p>
                  )} */}
            <div className="space-y-1">
              <Label htmlFor="userCode">Employee Code</Label>
              <Input
                id="userCode"
                type="text"
                className="peer"
                onChange={handleChange}
              ></Input>
              <p className="invisible peer-invalid:visible text-red-600 text-xs">
                Please provide valid user code
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                onChange={handleChange}
              ></Input>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default SigninForm;
