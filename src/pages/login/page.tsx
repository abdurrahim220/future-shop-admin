import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginFormInputs } from "@/types/loginTypes";
import { useForm } from "react-hook-form";

export default function LoginPage() {

  const dispatch = useAppDispatch()
   const {
     register,
     handleSubmit,
     formState: { errors, isSubmitting },
   } = useForm<LoginFormInputs>();
  const onSubmit = async (data: LoginFormInputs) => {
    
    
  }
  return (
    <section className="bg-background">
      {/* image */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center h-screen gap-6">
        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
            alt="Modern supermarket aisle"
            className="object-cover rounded-2xl w-full h-full scale-100 group-hover:scale-105 transition-transform duration-[20s] ease-out"
          />
        </div>
        {/* login form */}
        <div className="min-w-lg max-w-xs mx-auto">
          <Card className="bg-card p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-foreground">Login</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
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
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
