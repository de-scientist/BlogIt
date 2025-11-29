import { useForm, FieldErrors } from "react-hook-form";
import { useState, ReactNode } from "react";
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
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

type LoginForm = {
  identifier: string;
  password: string;
};

type FieldProps = {
  label: string;
  error?: FieldErrors<LoginForm>[keyof LoginForm];
  children: ReactNode;
};

// --- Field Component (Refined) ---
function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-gray-700 dark:text-gray-300">{label}</Label>
      {children}
      {error?.message && (
        <p className="text-red-600 text-sm font-medium mt-1">{error.message as string}</p>
      )}
    </div>
  );
}

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
      await api.post("/auth/login", data, {
        withCredentials: true,
      });
      
      setTimeout(() => navigate("/dashboard"), 800);
// 🚨 TOAST: Position bottom-left
      toast.success("Logged in successfully. Redirecting to dashboard...", { position: "bottom-left" }); 
    } catch (err: any) {
      const message = err.response?.data?.message || "An unexpected error occurred.";
      
      // Helper for consistent toast error placement
      const toastError = (msg: string) => toast.error(msg, { position: "bottom-left" });

      const lower = message.toLowerCase();
      
      if (
        lower.includes("credentials") ||
        lower.includes("identifier") ||
        lower.includes("username") ||
        lower.includes("email")
      ) {
        form.setError("identifier", { type: "server", message });
        return toastError(`Login ID Error: ${message}`);
      }
      
      if (lower.includes("password")) {
        form.setError("password", { type: "server", message });
        return toastError(`Password Error: ${message}`);
      }

      toastError(message);
    }
  };

  return (
    // 💡 Applied pt-16 (Navbar offset) and pl-4 (Sidebar offset)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center py-10">
      <Card className="w-full max-w-md shadow-2xl border-2 border-purple-100 dark:border-slate-700 dark:bg-slate-800 rounded-xl">
        <CardHeader className="bg-gray-50 dark:bg-slate-700 rounded-t-xl text-center py-6">
            <LogIn className="w-10 h-10 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
          {/* 💡 Professional Styling: Gradient Title */}
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                Welcome Back
            </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
            Enter your credentials to access your secure portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <Field
              label="Username or Email"
              error={form.formState.errors.identifier}
            >
              <Input
                placeholder="Enter your username or email"
                {...form.register("identifier", {
                  required: "Username or Email is required.",
                })}
                autoComplete="username"
                // 💡 Professional Styling: Dark mode and focused border
                className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
              />
            </Field>

            <Field label="Password" error={form.formState.errors.password}>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...form.register("password", {
                    required: "Password is required.",
                  })}
                  autoComplete="current-password"
                // 💡 Professional Styling: Dark mode and focused border
                  className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600 pr-12"
                />

                {/* 💡 Professional Styling: Password visibility toggle with Lucide icons */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 transition"
                    title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>

            {/* 💡 Professional Styling: Gradient Primary Button with Shadow */}
            <Button
              disabled={loading}
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-xl 
                            bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                            shadow-lg shadow-purple-500/40 hover:opacity-90 transition-all mt-6"
            >
              {loading ? (
                    <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
                    </span>
                ) : (
                    <span className="flex items-center justify-center">
                        <LogIn className="mr-2 h-5 w-5" /> Login
                    </span>
                )}
            </Button>
          </form>

          {/* 💡 Professional Styling: Register Link as Secondary Button */}
          <div className="text-center pt-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Don't have an account?</p>
            <Button
              variant="outline"
              className="w-full py-3 text-lg font-semibold rounded-xl 
                            border-green-500 text-green-600 dark:border-green-400 dark:text-green-400
                            hover:bg-green-50 dark:hover:bg-slate-700 transition-all"
              onClick={() => navigate("/auth/register")}
              disabled={loading}
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}