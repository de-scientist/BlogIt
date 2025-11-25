import { useForm, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { toast } from "sonner";
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
      if (!message) return toast.error("Login failed");

      const lower = message.toLowerCase();
      if (lower.includes("credentials") || lower.includes("identifier") || lower.includes("username") || lower.includes("email")) {
        form.setError("identifier", { type: "server", message });
        return;
      }
      if (lower.includes("password")) {
        form.setError("password", { type: "server", message });
        return;
      }

      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl text-gray-800">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Field label="Username or Email" error={form.formState.errors.identifier}>
              <Input
                placeholder="Enter your username or email"
                {...form.register("identifier", { required: "This field is required" })}
                autoComplete="username"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Field>

            <Field label="Password" error={form.formState.errors.password}>
              <Input
                type="password"
                placeholder="Enter your password"
                {...form.register("password", { required: "Password is required" })}
                autoComplete="current-password"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Field>

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-gray-700">{label}</Label>
      {children}
      {error?.message && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}
