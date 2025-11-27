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
import { Eye, EyeOff, UserPlus, Lock, Loader2 } from "lucide-react";

// --- 1. UPDATED TYPE: Added confirmPassword ---
type RegisterForm = {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string; // 🔑 NEW FIELD
};

type FieldProps = {
  label: string;
  error?: FieldErrors<RegisterForm>[keyof RegisterForm];
  children: ReactNode;
};

// Field Component (kept original structure)
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
      confirmPassword: "", // 🔑 Initialize new field
    },
    mode: "onSubmit",
  });

  const loading = form.formState.isSubmitting;

  // We only send the original fields to the API
  const handleSubmit = async (formData: RegisterForm) => {
    // Destructure to remove confirmPassword before sending to API
    const { confirmPassword, ...data } = formData; 

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
      
      // Error handling logic for server-side validation
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
        // Server-side password errors might also apply to confirmPassword, clear it too for UX
        form.setError("confirmPassword", { type: "server", message: "Password error from server" });
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
                {/* Skeletons for loading state */}
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" /> {/* Skeleton for Confirm Password */}
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
                            {...form.register("firstName", { required: "First name is required" })}
                            className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
                        />
                    </Field>

                    <Field label="Last Name" error={form.formState.errors.lastName}>
                        <Input
                            placeholder="Last Name"
                            {...form.register("lastName", { required: "Last name is required" })}
                            className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
                        />
                    </Field>
                </div>

                <Field label="Username" error={form.formState.errors.userName}>
                    <Input
                        placeholder="Choose a unique username"
                        {...form.register("userName", { required: "Username is required" })}
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
                        {...form.register("emailAddress", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          }
                        })}
                        className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600"
                    />
                </Field>

                {/* PASSWORD FIELD (Improved Validation) */}
                <Field label="Password" error={form.formState.errors.password}>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Choose a strong password"
                            {...form.register("password", { 
                              required: "Password is required",
                              minLength: { value: 8, message: "Password must be at least 8 characters" }
                            })}
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

                {/* 🔑 NEW FIELD: CONFIRM PASSWORD (Validation Added) */}
                <Field label="Confirm Password" error={form.formState.errors.confirmPassword}>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            {...form.register("confirmPassword", { 
                              required: "Please confirm your password",
                              // 🔑 Custom validation rule to match password
                              validate: (value) => 
                                form.getValues("password") === value || "Passwords do not match"
                            })}
                            className="dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-600 focus:ring-purple-600 pr-12"
                        />
                        {/* Using the same visibility toggle for confirm password */}
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
                        <span className="flex items-center justify-center">
                            <Loader2 size={20} className="mr-2 animate-spin" /> Creating Account...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">
                            <UserPlus size={20} className="mr-2" /> Create Account
                        </span>
                    )}
                </Button>

                {/* Login Redirect Button */}
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Already have an account?</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/auth/login")}
                    className="w-full py-3 text-lg font-semibold rounded-xl 
                                border-green-500 text-green-600 dark:border-green-400 dark:text-green-400
                                hover:bg-green-50 dark:hover:bg-slate-700 transition-all"
                    disabled={loading}
                  >
                    Log In
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}