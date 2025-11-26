import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // 💡 Import the spinner icon

// --- Form Type ---
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- Error Mapping Dictionary ---
const serverErrorMap = new Map<string, keyof PasswordForm>([
    ["Incorrect credentials", "currentPassword"],
    ["Please use a stronger password", "newPassword"],
]);


export default function UpdatePasswordPage() {
  
  // 1. Setup Form with Manual Validation
  const form = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const { getValues, setError } = form;

  // 2. Setup Mutation Hook
  const updatePasswordMutation = useMutation({
    mutationFn: async (payload: PasswordForm) => {
      const { currentPassword, newPassword } = payload;
      
      return await api.patch("/auth/update-password", {
        currentPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password updated successfully.");
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;

      if (errorMessage) {
        let fieldToTarget: keyof PasswordForm | undefined = undefined;

        for (const [key, value] of serverErrorMap.entries()) {
            if (errorMessage.includes(key)) {
                fieldToTarget = value;
                break;
            }
        }
        
        if (fieldToTarget) {
            setError(fieldToTarget, {
                type: "server",
                message: errorMessage,
            });
            toast.error(`Update failed: ${errorMessage}`);
        } else {
            toast.error(errorMessage || "Password update failed. Kindly try again.");
        }
      } else {
        toast.error("An unknown error occurred during update.");
      }
    },
  });

  const isPending = updatePasswordMutation.isPending;

  const onSubmit = (values: PasswordForm) => {
    updatePasswordMutation.mutate(values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg shadow-xl border-gray-200 rounded-2xl bg-white p-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Change Your Password
          </CardTitle>
        </CardHeader>
        
        <CardContent className="mt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Current Password Field */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="font-medium">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                className="rounded-xl"
                {...form.register("currentPassword", {
                    required: "Current password is required.",
                })}
              />
              {form.formState.errors.currentPassword && (
                <p className="text-sm text-red-500">{form.formState.errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-medium">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password (min 8 chars)"
                className="rounded-xl"
                {...form.register("newPassword", {
                    required: "New password is required.",
                    minLength: {
                        value: 8,
                        message: "New password must be at least 8 characters.",
                    },
                })}
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500">{form.formState.errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                className="rounded-xl"
                {...form.register("confirmPassword", {
                    required: "Confirm password is required.",
                    validate: (value) => 
                        value === getValues("newPassword") || "Passwords must match.",
                })}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button with Spinner Logic */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-3 text-lg font-semibold rounded-xl 
                         bg-gradient-to-r from-green-500 to-teal-400 text-white 
                         hover:opacity-90 transition-all shadow-lg mt-6"
            >
              {isPending ? (
                // Display spinner when pending
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                // Display regular text when not pending
                "Update Password"
              )}
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}