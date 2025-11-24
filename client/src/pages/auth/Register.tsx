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
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

type FieldProps = {
  label: string;
  error?: FieldError;
  children: ReactNode;
};

const registerSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  userName: z.string().min(3, "Username must have at least 3 characters"),
  emailAddress: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const loading = form.formState.isSubmitting;

  const handleSubmit = async (data: RegisterForm) => {
    try {
      await axios.post("/api/auth/register", data);

      toast.success("Registration successful");

      form.reset();

      // Redirect after success
      setTimeout(() => {
        navigate("/auth/login");
      }, 600);

    } catch (e) {
      toast.error("Registration failed");
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
                <Field label="First Name" error={form.formState.errors.firstName}>
                  <Input placeholder="Enter first name" {...form.register("firstName")} />
                </Field>

                <Field label="Last Name" error={form.formState.errors.lastName}>
                  <Input placeholder="Enter last name" {...form.register("lastName")} />
                </Field>

                <Field label="Username" error={form.formState.errors.userName}>
                  <Input placeholder="Choose a username" {...form.register("userName")} />
                </Field>

                <Field label="Email Address" error={form.formState.errors.emailAddress}>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...form.register("emailAddress")}
                  />
                </Field>

                <Field label="Password" error={form.formState.errors.password}>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...form.register("password")}
                  />
                </Field>

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

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
