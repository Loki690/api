import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useSignIn } from "@/services/authService";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

const SigninForm: React.FC = () => {
  const [formData, setFormData] = useState({ userCode: "", password: "" });
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const { mutate: signInUser, isPending } = useSignIn();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.userCode || !formData.password) {
      toast({ title: "Warning!", description: "Please fill up the fields" });
      return;
    }

    signInUser(formData, {
      onSuccess: (data) => {
        signIn(data);

        // Role-based navigation
        switch (data.role) {
          case "Admin":
            navigate(`/admin/items/${data.project}`);
            toast({
              title: "Admin Login Successful",
              description: "Redirected to Admin Dashboard",
            });
            break;

          case "Head":
            navigate(`/admin/items/${data.project}`);
            toast({
              title: "Head Login Successful",
              description: "Redirected to Dashboard",
            });
            break;

          case "Inventory":
          case "Crew":
            navigate(`/items/${data.project}`);
            toast({
              title: "Login Successful",
              description: "Redirected to Project",
            });
            break;

          default:
            toast({
              title: "Access Denied",
              description: "Your role does not have access to the system",
            });
            break;
        }
      },
      onError: (error) => {
        toast({ title: error.message, description: "Please try again!" });
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
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default SigninForm;
