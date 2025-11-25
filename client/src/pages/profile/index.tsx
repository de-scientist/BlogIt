import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProfileForm {
  firstName: string;
  lastName: string;
  emailAddress: string;
  userName: string;
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile", { withCredentials: true })).data,
  });

  // Setup validation rules directly in useForm
  const form = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      userName: "",
    },
    mode: "onSubmit", // validate on submit
  });

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
    mutationFn: async (payload: ProfileForm) =>
      (
        await api.patch(
          "/profile",
          {
            firstName: payload.firstName,
            lastName: payload.lastName,
            emailAddress: payload.emailAddress,
            userName: payload.userName,
          },
          { withCredentials: true }
        )
      ).data,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <div>
              <Label>First Name</Label>
              <Input
                {...form.register("firstName", { required: "First name is required" })}
              />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                {...form.register("lastName", { required: "Last name is required" })}
              />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                {...form.register("emailAddress", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {form.formState.errors.emailAddress && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.emailAddress.message}
                </p>
              )}
            </div>

            <div>
              <Label>Username</Label>
              <Input
                {...form.register("userName", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                })}
              />
              {form.formState.errors.userName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.userName.message}
                </p>
              )}
            </div>

            <Button type="submit">
              {mutation.isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
