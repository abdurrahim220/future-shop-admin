import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/features/auth/authSlice";
import type { LoginFormInputs } from "@/types/loginTypes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    // console.log("data", data);
    dispatch(loginUser(data));
  };

  return (
    <section className="bg-background">
      {/* image */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center h-screen gap-6">
        <div className="hidden lg:block h-[80vh]">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
            alt="Modern supermarket aisle"
            className="object-cover rounded-2xl w-full h-full scale-100 group-hover:scale-105 transition-transform duration-[20s] ease-out"
          />
        </div>
        {/* login form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-card p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-foreground">Login</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Phone</Label>
                  <Input
                    id="identifier"
                    type="text"
                    className="ring-0 focus-visible:ring-0"
                    placeholder="your.email@example.com"
                    {...register("identifier", {
                      required: "Email or phone is required",
                    })}
                  />
                  {errors.identifier && (
                    <p className="text-red-500 text-sm">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="ring-0 focus-visible:ring-0"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
