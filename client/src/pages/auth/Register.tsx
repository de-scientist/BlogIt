import { useForm, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import { Eye, EyeOff, UserPlus, Lock } from "lucide-react"; // 💡 Added icons

// Re-defining types (kept original)
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

// Re-defining Field component (kept original structure)
function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-gray-700 dark:text-gray-300">{label}</Label>
      {children}
      {error?.message && (
        <p className="text-red-600 text-sm">{error.message as string}</p>
      )}
    </div>
  );
}


export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      // 💡 TOAST: Position bottom-left
      toast.success("Registration successful! Redirecting to login...", { position: "bottom-left" }); 
      form.reset();
      setTimeout(() => navigate("/auth/login"), 1000);
    } catch (err: any) {
      const message: string = err.response?.data?.message || "An unexpected error occurred.";
      
      // 💡 TOAST: Position bottom-left for error
      const toastError = (msg: string) => toast.error(msg, { position: "bottom-left" });

      const lower = message.toLowerCase();
      if (lower.includes("first name")) {
        form.setError("firstName", { type: "server", message });
        return toastError("First Name Error: " + message);
      }
      if (lower.includes("last name")) {
        form.setError("lastName", { type: "server", message });
        return toastError("Last Name Error: " + message);
      }
      if (lower.includes("user name") || lower.includes("username")) {
        form.setError("userName", { type: "server", message });
        return toastError("Username Error: " + message);
      }
      if (lower.includes("email")) {
        form.setError("emailAddress", { type: "server", message });
        return toastError("Email Error: " + message);
      }
      if (lower.includes("password")) {
        form.setError("password", { type: "server", message });
        return toastError("Password Error: " + message);
      }

      toastError(message);
    }
  };

  return (
    // 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center py-10">
      <Card className="w-full max-w-lg shadow-2xl border-2 border-purple-100 dark:border-slate-700 dark:bg-slate-800 rounded-xl">
        <CardHeader className="bg-gray-50 dark:bg-slate-700 rounded-t-xl text-center py-6">
            <UserPlus className="w-10 h-10 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Join Our Community
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
            Enter your details below to create your powerful new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {loading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full mt-4" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                    <Field
                        label="First Name"
                        error={form.formState.errors.firstName}
                    >
                        <Input
                            placeholder="First Name"
                            {...form.register("firstName")}
                            className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
                        />
                    </Field>

                    <Field label="Last Name" error={form.formState.errors.lastName}>
                        <Input
                            placeholder="Last Name"
                            {...form.register("lastName")}
                            className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
                        />
                    </Field>
                </div>

                <Field label="Username" error={form.formState.errors.userName}>
                    <Input
                        placeholder="Choose a unique username"
                        {...form.register("userName")}
                        className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
                    />
                </Field>

                <Field
                    label="Email Address"
                    error={form.formState.errors.emailAddress}
                >
                    <Input
                        type="email"
                        placeholder="example@domain.com"
                        {...form.register("emailAddress")}
                        className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
                    />
                </Field>

                {/* PASSWORD WITH EYE TOGGLE (Improved Styling) */}
                <Field label="Password" error={form.formState.errors.password}>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Choose a strong password"
                            {...form.register("password")}
                            className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-purple-600 transition"
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </Field>

                {/* Gradient Submit Button */}
                <Button
                    type="submit"
                    className="w-full py-3 text-lg font-semibold rounded-xl 
                                bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                                shadow-lg shadow-purple-500/40 hover:opacity-90 transition-all mt-4"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <Lock size={20} className="mr-2 animate-spin" /> Creating Account...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <Lock size={20} className="mr-2" /> Create Account
                        </span>
                    )}
                </Button>

                {/* Login Redirect Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/auth/login")}
                    className="w-full py-3 text-lg font-semibold rounded-xl 
                                border-green-500 text-green-600 dark:border-green-400 dark:text-green-400
                                hover:bg-green-50 dark:hover:bg-slate-700 transition-all"
                    disabled={loading}
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