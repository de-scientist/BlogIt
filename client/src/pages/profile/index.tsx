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

  const form = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      userName: "",
    },
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
    mutationFn: async (payload: ProfileForm) => {
      return (
        await api.patch("/profile", payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        })
      ).data;
    },
    onSuccess: () => {
      toast.success("Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Update failed.");
    },
  });

  if (isLoading) return <div className="p-10 text-gray-500">Loading...</div>;

  function onSubmit(values: ProfileForm) {
    mutation.mutate(values);
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <Label>First Name</Label>
              <Input
                {...form.register("firstName")}
                className="mt-1"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                {...form.register("lastName")}
                className="mt-1"
                placeholder="Enter last name"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Email Address</Label>
              <Input
                {...form.register("emailAddress")}
                className="mt-1"
                placeholder="Enter email"
                type="email"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Username</Label>
              <Input
                {...form.register("userName")}
                className="mt-1"
                placeholder="Enter username"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="px-6"
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
