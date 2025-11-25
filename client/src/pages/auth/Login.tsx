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
  identifier: string;
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
    defaultValues: { identifier: "", password: "" },
    mode: "onSubmit",
  });

  const loading = form.formState.isSubmitting;

  const handleSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data, { withCredentials: true });
      toast.success("Logged in successfully");
      setTimeout(() => navigate("/profile"), 600);
    } catch (err: any) {
      const message = err.response?.data?.message;

      if (!message) {
        toast.error("Login failed");
        return;
      }

      // Map server errors to input fields
      if (
        message.toLowerCase().includes("credentials") ||
        message.toLowerCase().includes("identifier") ||
        message.toLowerCase().includes("username") ||
        message.toLowerCase().includes("email")
      ) {
        form.setError("identifier", { type: "server", message });
        return;
      }

      if (message.toLowerCase().includes("password")) {
        form.setError("password", { type: "server", message });
        return;
      }

      // fallback for unexpected server messages
      toast.error(message);
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
                {...form.register("identifier", { required: "This field is required" })}
                autoComplete="username"
              />
            </Field>

            <Field label="Password" error={form.formState.errors.password}>
              <Input
                type="password"
                placeholder="Enter your password"
                {...form.register("password", { required: "Password is required" })}
                autoComplete="current-password"
              />
            </Field>

            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Logging in..." : "Login"}
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
      {error?.message && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
