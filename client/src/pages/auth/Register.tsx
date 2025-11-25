import { useForm, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

type RegisterForm = {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  password: string;
};

type FieldProps = {
  label: string;
  error?: FieldErrors<RegisterForm>[keyof RegisterForm];
  children: ReactNode;
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
      await api.post("/auth/register", data, { withCredentials: true });

      toast.success("Registration successful");
      form.reset();
      setTimeout(() => navigate("/auth/login"), 600);
    } catch (err: any) {
  const message: string = err.response?.data?.message;

  if (!message) {
    toast.error("Registration failed");
    return;
  }

  const lower = message.toLowerCase();

  // Required fields
  if (lower.includes("first name")) {
    form.setError("firstName", { type: "server", message });
    return;
  }

  if (lower.includes("last name")) {
    form.setError("lastName", { type: "server", message });
    return;
  }

  if (lower.includes("user name") || lower.includes("username")) {
    form.setError("userName", { type: "server", message });
    return;
  }

  if (lower.includes("email")) {
    form.setError("emailAddress", { type: "server", message });
    return;
  }

  if (lower.includes("password")) {
    form.setError("password", { type: "server", message });
    return;
  }

  // Default fallback
  toast.error(message);
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
                <Field
                  label="First Name"
                  error={form.formState.errors.firstName}
                >
                  <Input
                    placeholder="Enter first name"
                    {...form.register("firstName")}
                    autoComplete="firstName"
                  />
                </Field>

                <Field label="Last Name" error={form.formState.errors.lastName}>
                  <Input
                    placeholder="Enter last name"
                    {...form.register("lastName")}
                    autoComplete="lastName"
                  />
                </Field>

                <Field label="Username" error={form.formState.errors.userName}>
                  <Input
                    placeholder="Choose a username"
                    {...form.register("userName")}
                    autoComplete="username"
                  />
                </Field>

                <Field
                  label="Email Address"
                  error={form.formState.errors.emailAddress}
                >
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...form.register("emailAddress")}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Password" error={form.formState.errors.password}>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...form.register("password")}
                    autoComplete="current-password"
                  />
                </Field>

                <Button type="submit" className="w-full" disabled={loading}>
                  Create Account
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2 bg-green-500 text-white hover:bg-green-700"
                  onClick={() => navigate("/auth/login")}
                >
                  Already have an account? Log In
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error?.message && (
        <p className="text-red-500 text-sm">{error.message as string}</p>
      )}
    </div>
  );
}
