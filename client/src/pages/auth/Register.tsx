import { useForm, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { toast } from "sonner";
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
      if (!message) return toast.error("Registration failed");

      const lower = message.toLowerCase();
      if (lower.includes("first name")) return form.setError("firstName", { type: "server", message });
      if (lower.includes("last name")) return form.setError("lastName", { type: "server", message });
      if (lower.includes("user name") || lower.includes("username")) return form.setError("userName", { type: "server", message });
      if (lower.includes("email")) return form.setError("emailAddress", { type: "server", message });
      if (lower.includes("password")) return form.setError("password", { type: "server", message });

      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl text-gray-800">Create Account</CardTitle>
            <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
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
                  <Input
                    placeholder="Enter first name"
                    {...form.register("firstName")}
                    autoComplete="firstName"
                    className="border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                  />
                </Field>

                <Field label="Last Name" error={form.formState.errors.lastName}>
                  <Input
                    placeholder="Enter last name"
                    {...form.register("lastName")}
                    autoComplete="lastName"
                    className="border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                  />
                </Field>

                <Field label="Username" error={form.formState.errors.userName}>
                  <Input
                    placeholder="Choose a username"
                    {...form.register("userName")}
                    autoComplete="username"
                    className="border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                  />
                </Field>

                <Field label="Email Address" error={form.formState.errors.emailAddress}>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...form.register("emailAddress")}
                    autoComplete="email"
                    className="border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                  />
                </Field>

                <Field label="Password" error={form.formState.errors.password}>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...form.register("password")}
                    autoComplete="current-password"
                    className="border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                  />
                </Field>

                {/* Gradient Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-all"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Login Redirect Button */}
                <Button
                  type="button"
                  className="w-full mt-2 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:opacity-90 transition-all"
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
      <Label className="text-gray-700">{label}</Label>
      {children}
      {error?.message && <p className="text-red-600 text-sm">{error.message as string}</p>}
    </div>
  );
}
