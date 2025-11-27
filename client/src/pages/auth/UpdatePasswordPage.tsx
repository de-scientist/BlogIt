import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom"; 
import { Lock, Loader2, ShieldCheck, AlertTriangle } from "lucide-react"; // 💡 Imported icons

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    
    const navigate = useNavigate();

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
            
            return await api.patch("/auth/password", {
                currentPassword,
                newPassword,
            });
        },
        onSuccess: () => {
            // 💡 Set toast position to bottom-left
            toast.success("Password updated successfully.", { position: "bottom-left" });
            form.reset();
            // Assuming your profile page route is '/profile'
            navigate("/profile"); 
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
                    // 💡 Set toast position to bottom-left
                    toast.error(`Update failed: ${errorMessage}`, { position: "bottom-left" });
                } else {
                    // 💡 Set toast position to bottom-left
                    toast.error(errorMessage || "Password update failed. Kindly try again.", { position: "bottom-left" });
                }
            } else {
                // 💡 Set toast position to bottom-left
                toast.error("An unknown error occurred during update.", { position: "bottom-left" });
            }
        },
    });

    const isPending = updatePasswordMutation.isPending;

    const onSubmit = (values: PasswordForm) => {
        updatePasswordMutation.mutate(values);
    };

    return (
        // 💡 Adjusted main container padding for Navbar (pt-16) and Sidebar (pl-4)
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">
            
            <div className="max-w-xl mx-auto">
                
                {/* ---------------------------------- */}
                {/* HEADER AND CLEAR MESSAGE */}
                {/* ---------------------------------- */}
                <header className="py-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
                        <Lock className="w-8 h-8 mr-3 text-red-600" /> Account Security
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        Protect your account by regularly updating your password.
                    </p>
                    <hr className="mt-4 border-gray-200 dark:border-gray-700" />
                </header>

                {/* 💡 NEW: Professional Security Banner */}
                <div className="mb-8 flex p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-300 border border-blue-200" role="alert">
                    <ShieldCheck className="flex-shrink-0 inline w-5 h-5 mr-3 mt-0.5" />
                    <span className="sr-only">Security</span>
                    <div>
                        <span className="font-medium">Security Tip:</span> For maximum security, use a **unique** password that is at least 12 characters long, including letters, numbers, and symbols.
                    </div>
                </div>

                {/* ---------------------------------- */}
                {/* MAIN FORM CARD */}
                {/* ---------------------------------- */}
                <Card className="shadow-2xl border-t-4 border-red-600 dark:bg-slate-800 rounded-xl w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                            <AlertTriangle className="w-6 h-6 mr-2 text-red-600" /> Update Credentials
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="mt-4">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Current Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword" className="font-medium dark:text-gray-300">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Enter your current password"
                                    className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
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
                                <Label htmlFor="newPassword" className="font-medium dark:text-gray-300">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password (min 8 chars)"
                                    className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
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
                                <Label htmlFor="confirmPassword" className="font-medium dark:text-gray-300">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your new password"
                                    className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
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
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full py-3 text-lg font-semibold rounded-lg 
                                                bg-gradient-to-r from-red-600 to-pink-500 text-white 
                                                hover:opacity-90 transition-all shadow-lg"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>
                            </div>
                            
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}