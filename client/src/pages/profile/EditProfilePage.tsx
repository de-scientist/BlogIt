import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { Loader2, User, AlertTriangle, Save } from "lucide-react"; // 💡 Imported icons

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// --- Form and Data Types ---
interface ProfileData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  userName: string;
}

type ProfileForm = ProfileData;

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. FETCH current profile data
  const { 
    data, 
    isLoading: isFetching,
    isError,
    error
  } = useQuery<ProfileData, Error>({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile")).data,
    staleTime: 5 * 60 * 1000,
  });

  // 💡 Handle Fetching Error, setting toast position to bottom-left
  useEffect(() => {
    if (isError && error) {
      const errorMessage = (error as any).response?.data?.message || error.message || "Failed to load profile data.";
      toast.error(errorMessage, { position: "bottom-left" });
    }
  }, [isError, error]);

  // 2. Setup Form
  const form = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      userName: "",
    },
  });

  // 3. Populate form when data loads
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);


  // 4. Setup Mutation Hook
  const updateMutation = useMutation({
    mutationFn: async (payload: ProfileForm) => {
      return await api.patch("/profile", payload);
    },
    onSuccess: () => {
      // 💡 Set toast position to bottom-left
      toast.success("Profile updated successfully!", { position: "bottom-left" });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); 
      navigate("/profile/view"); // Assuming '/profile/view' is the correct view path
    },
    onError: (error: any) => {
      // 💡 Set toast position to bottom-left
      toast.error(error.response?.data?.message || "Update failed! Please try again.", { position: "bottom-left" });
    },
  });

  const isPending = updateMutation.isPending;
  const isFormLoading = isFetching || isPending;

  // Render loading state if fetching profile data
  if (isFetching) {
    return (
        // 💡 Adjusted loading state for Navbar (pt-16) and Sidebar (pl-4)
        <div className="pt-16 pl-4 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Loading Profile...</span>
        </div>
    );
  }

  // Render the form
  return (
    // 💡 Adjusted main container padding for Navbar (pt-16) and Sidebar (pl-4)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">

      {/* ---------------------------------- */}
      {/* HEADER AND CLEAR MESSAGE */}
      {/* ---------------------------------- */}
      <header className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
              <User className="w-8 h-8 mr-3 text-green-600" /> Edit Personal Information
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Update your details below. Changes will be reflected immediately across the platform.
          </p>
          <hr className="mt-4 border-gray-200 dark:border-gray-700" />
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-0 space-y-8">
        
        {/* 💡 NEW: Professional Banner/Alert */}
        <div className="flex p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 border border-yellow-200" role="alert">
            <AlertTriangle className="flex-shrink-0 inline w-5 h-5 mr-3 mt-0.5" />
            <span className="sr-only">Warning</span>
            <div>
                <span className="font-medium">Attention:</span> Changing your **Username** or **Email Address** may require re-authentication for security purposes.
            </div>
        </div>

        {/* ---------------------------------- */}
        {/* MAIN FORM CARD */}
        {/* ---------------------------------- */}
        <Card className="shadow-2xl border-t-4 border-green-600 dark:bg-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                <Save className="w-6 h-6 mr-2 text-green-600" /> Data Fields
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-4">
            <form
              onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* First Name Field */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-medium dark:text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  {...form.register("firstName", { required: "First Name is required" })}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-medium dark:text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  {...form.register("lastName", { required: "Last Name is required" })}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>

              {/* Email Address Field */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emailAddress" className="font-medium dark:text-gray-300">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  {...form.register("emailAddress", { 
                      required: "Email is required",
                      pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address format",
                      }
                  })}
                />
                {form.formState.errors.emailAddress && (
                  <p className="text-sm text-red-500">{form.formState.errors.emailAddress.message}</p>
                )}
              </div>
              
              {/* Username Field */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="userName" className="font-medium dark:text-gray-300">Username</Label>
                <Input
                  id="userName"
                  className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  {...form.register("userName", { required: "Username is required" })}
                />
                {form.formState.errors.userName && (
                  <p className="text-sm text-red-500">{form.formState.errors.userName.message}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <div className="md:col-span-2 pt-4 flex justify-end">
                  <Button
                      type="submit"
                      disabled={isFormLoading}
                      className="w-48 py-2.5 text-base font-semibold rounded-lg 
                                bg-gradient-to-r from-green-500 to-teal-400 text-white 
                                hover:opacity-90 transition-all shadow-md"
                  >
                      {isPending ? (
                          <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Saving...
                          </>
                      ) : (
                          "Save Changes"
                      )}
                  </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Note: The Toaster component must be rendered once at the root/app level
               to ensure all toasts appear regardless of component mount state. */}
    </div>
  );
}