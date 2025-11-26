import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios"; // Assuming your configured axios instance
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
  // Note: Add 'avatarUrl?: string' here if you include avatar logic later
}

type ProfileForm = ProfileData; // Form payload matches data structure

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. FETCH current profile data
  const { data, isLoading: isFetching } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile")).data, // Assuming /profile is your GET endpoint
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to load profile data.");
    }
  });

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
      // Send the PATCH request to the server
      return await api.patch("/profile", payload); // Assuming /profile is your PATCH endpoint
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      // Invalidate the profile query to force a fresh fetch next time
      queryClient.invalidateQueries({ queryKey: ["profile"] }); 
      // Redirect back to the profile view page after successful update
      navigate("/profile"); 
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed! Please try again.");
    },
  });

  const isPending = updateMutation.isPending;
  const isFormLoading = isFetching || isPending;

  // Render loading state if fetching profile data
  if (isFetching) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-700">Loading Profile...</span>
        </div>
    );
  }

  // Render the form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-xl shadow-2xl border-gray-200 rounded-xl bg-white p-6">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Edit Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-6">
          <form
            onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
            className="space-y-6"
          >
            {/* First Name Field */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-medium">First Name</Label>
              <Input
                id="firstName"
                className="rounded-xl"
                {...form.register("firstName", { required: "First Name is required" })}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-medium">Last Name</Label>
              <Input
                id="lastName"
                className="rounded-xl"
                {...form.register("lastName", { required: "Last Name is required" })}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="userName" className="font-medium">Username</Label>
              <Input
                id="userName"
                className="rounded-xl"
                {...form.register("userName", { required: "Username is required" })}
              />
              {form.formState.errors.userName && (
                <p className="text-sm text-red-500">{form.formState.errors.userName.message}</p>
              )}
            </div>
            
            {/* Email Address Field (often disabled or read-only) */}
            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="font-medium">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                className="rounded-xl"
                {...form.register("emailAddress", { 
                    required: "Email is required",
                    // You might want a pattern or validation for email format here
                })}
              />
              {form.formState.errors.emailAddress && (
                <p className="text-sm text-red-500">{form.formState.errors.emailAddress.message}</p>
              )}
            </div>

            {/* Submit Button (Styled like the green/teal button) */}
            <Button
              type="submit"
              disabled={isFormLoading}
              className="w-full py-3 text-lg font-semibold rounded-xl 
                         bg-gradient-to-r from-green-500 to-teal-400 text-white 
                         hover:opacity-90 transition-all shadow-lg mt-6"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}