import { useForm, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

type LoginForm = {
  identifier: string; // backend expects this
  password: string;
};

type FieldProps = {
  label: string;
  error?: FieldErrors<LoginForm>[keyof LoginForm];
  children: ReactNode;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const handleSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data, { withCredentials: true });

      toast.success("Logged in successfully");

      // Redirect after login
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // server returned field-specific errors
        const errors = err.response.data.errors;
        Object.keys(errors).forEach((key) => {
          form.setError(key as keyof LoginForm, {
            type: "server",
            message: errors[key],
          });
        });
      } else {
        toast.error(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Field label="Username or Email" error={form.formState.errors.identifier}>
              <Input
                placeholder="Enter your username or email"
                {...form.register("identifier")}
                autoComplete="username"
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

            <Button disabled={loading} type="submit" className="w-full">
              Login
            </Button>
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
