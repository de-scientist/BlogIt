import { useForm, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";


type FieldProps = {
  label: string;
  error?: FieldErrors<RegisterForm>[keyof RegisterForm];
  children: ReactNode;
};

type RegisterForm = {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  password: string;
};


export default function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      emailAddress: "",
      password: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const handleSubmit = async (data: RegisterForm) => {
    try {
      const response = await axios.post("/api/auth/register", data, { withCredentials: true });

      toast.success("Registration successful");
      form.reset();

      // Redirect after success
      setTimeout(() => navigate("/auth/login"), 600);

    } catch (err: any) {
      // Handle server errors and display on fields
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach((key) => {
          form.setError(key as keyof RegisterForm, {
            type: "server",
            message: errors[key],
          });
        });
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  <Input type="email" placeholder="example@gmail.com" {...form.register("emailAddress")} autoComplete="email" />
                </Field>

                <Field label="Password" error={form.formState.errors.password}>
                  <Input type="password" placeholder="Enter password" {...form.register("password")} />
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

// ---------------------
// Field Component
// ---------------------
function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error?.message && <p className="text-red-500 text-sm">{error.message as string}</p>}
    </div>
  );
}
