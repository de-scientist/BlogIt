import { useForm, FieldErrors } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
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

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 space-y-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl text-gray-800">Login</CardTitle>
            <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
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
  <div className="relative">
    <Input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      {...form.register("password", { required: "Password is required" })}
      autoComplete="current-password"
      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
    />

    {/* 🔹 Password visibility toggle */}
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.807 7.244 19.5 12 19.5c1.913 0 3.704-.56 5.23-1.52M8.53 8.53A3.75 3.75 0 0115.47 15.47M9.878 9.878L4.5 4.5m5.378 5.378L19.5 19.5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M2.036 12.322C3.423 7.36 7.35 4 12 4c4.65 0 8.577 3.36 9.964 8.322a1.032 1.032 0 010 .356C20.577 16.64 16.65 20 12 20c-4.65 0-8.577-3.36-9.964-8.322a1.032 1.032 0 010-.356z" />
          <circle cx="12" cy="12" r="3.75" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  </div>
</Field>


            <Button
              disabled={loading}
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* 🔹 REGISTER BUTTON */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm mb-2">Don't have an account?</p>
            <Button
              variant="default"
              className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-500 to-teal-400 text-white hover:opacity-90 transition-all"
              onClick={() => navigate("/auth/register")}
            >
              Register
            </Button>
          </div>
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

