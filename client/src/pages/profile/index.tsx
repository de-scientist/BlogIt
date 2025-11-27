import { useEffect } from "react";
// 💡 Imported useForm from react-hook-form to use formState and register validation
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
// 💡 Imported Sonner components for toast customization
import { toast, Toaster } from "sonner"; 
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react"; 

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 


interface ProfileForm {
  firstName: string;
  lastName: string;
  emailAddress: string;
  userName: string;
}

// 💡 Helper function to get initials for the fallback avatar
const getInitials = (firstName: string, lastName: string) => {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return (f + l).toUpperCase() || 'U';
};


export default function ProfilePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile", { withCredentials: true })).data,
  });

  const form = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      userName: "",
    },
    // 💡 Defined validation mode to appear after user submits
    mode: "onSubmit", 
  });

  const { formState: { errors } } = form; // Destructure errors for display

  useEffect(() => {
    if (data) {
      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        userName: data.userName,
      });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: async (payload: ProfileForm) => {
      return (
        await api.patch("/profile", payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        })
      ).data;
    },
    onSuccess: () => {
      // 💡 Updated toast message and position
      toast.success("Profile updated successfully.", { position: "bottom-right" }); 
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      // 💡 Updated toast position
      toast.error(err.response?.data?.message || "Update failed. Please check your inputs.", { position: "bottom-right" });
    },
  });

  if (isLoading) return <div className="p-10 text-gray-500 pt-16 pl-64">Loading...</div>;

  function onSubmit(values: ProfileForm) {
    mutation.mutate(values);
  }

  const initials = getInitials(data?.firstName, data?.lastName);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-64 pb-10">
      
      {/* ---------------------------------- */}
      {/* HEADER AND CLEAR MESSAGE */}
      {/* ---------------------------------- */}
      <header className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
              <User className="w-8 h-8 mr-3 text-purple-600" /> Welcome, {data?.firstName || 'User'}!
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Manage your personal information and account settings here. Your profile defines your identity on the platform.
          </p>
          <hr className="mt-4 border-gray-200 dark:border-gray-700" />
      </header>


      <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-0">
          
        {/* ---------------------------------- */}
        {/* PROFILE PICTURE/AVATAR CARD (Simplified: Initials-only) */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg dark:bg-slate-800 border-t-4 border-purple-600">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                    Profile Identity
                </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center space-x-6">
                
                <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-900 shadow-md">
                    <AvatarFallback className="text-3xl font-bold bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <div>
                    {/* 💡 Updated message to be welcoming */}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your current profile initials are **{initials}**. They will automatically update based on your saved names.
                    </p>
                    <div className="text-xs text-gray-500 italic">
                        Current Name: **{data?.firstName || ''} {data?.lastName || ''}**
                    </div>
                </div>
            </CardContent>
        </Card>


        {/* ---------------------------------- */}
        {/* ACCOUNT SETTINGS / FORM CARD */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg dark:bg-slate-800 border-t-4 border-indigo-600">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
                <Lock className="w-6 h-6 mr-2 text-indigo-600" /> Personal Information
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your name, username, and email. All fields are required.
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName", { required: "First Name is required" })} 
                  className="mt-1 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName", { required: "Last Name is required" })} 
                  className="mt-1 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  {...form.register("emailAddress", { required: "Email Address is required" })} 
                  className="mt-1 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Enter email"
                  type="email"
                />
                {errors.emailAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.emailAddress.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  {...form.register("userName", { required: "Username is required" })} 
                  className="mt-1 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Enter username"
                />
                {errors.userName && (
                    <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-6 bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90 dark:from-green-700 dark:to-teal-500"
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* 💡 Ensure Sonner component is present for toasts to display */}
      <Toaster position="bottom-right" /> 
    </div>
  );
}