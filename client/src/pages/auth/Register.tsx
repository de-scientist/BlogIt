import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  userName: z.string().min(3, "Username must have at least 3 characters"),
  emailAddress: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const loading = form.formState.isSubmitting;

  const handleSubmit = async (data: RegisterForm) => {
    try {
      await axios.post("/api/auth/register", data);
      toast({ title: "Registration successful" });

      form.reset();

      // 🔥 Redirect to login after success
      setTimeout(() => {
        router.push("/auth/login");
      }, 600);

    } catch (e) {
      toast({ title: "Registration failed", variant: "destructive" });
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {loading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : (
              <>
                <div>
                  <Label>First Name</Label>
                  <Input placeholder="Enter first name" {...form.register("firstName")} />
                  {form.formState.errors.firstName && (
                    <p className="text-red-500 text-sm">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input placeholder="Enter last name" {...form.register("lastName")} />
                  {form.formState.errors.lastName && (
                    <p className="text-red-500 text-sm">{form.formState.errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <Label>Username</Label>
                  <Input placeholder="Choose a username" {...form.register("userName")} />
                  {form.formState.errors.userName && (
                    <p className="text-red-500 text-sm">{form.formState.errors.userName.message}</p>
                  )}
                </div>

                <div>
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="example@gmail.com" {...form.register("emailAddress")} />
                  {form.formState.errors.emailAddress && (
                    <p className="text-red-500 text-sm">{form.formState.errors.emailAddress.message}</p>
                  )}
                </div>

                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" {...form.register("password")} />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Create Account
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
