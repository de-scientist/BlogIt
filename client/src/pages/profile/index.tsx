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
    mutationFn: async (payload: ProfileForm) =>
      (await api.patch("/profile", { ...payload }, { withCredentials: true }))
        .data,
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

  return (
    <div className="flex justify-center py-14 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-xl shadow-xl border-gray-200 rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">
            Update Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-4">
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="font-medium">First Name</Label>
              <Input
                className="rounded-xl"
                {...form.register("firstName", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Last Name</Label>
              <Input
                className="rounded-xl"
                {...form.register("lastName", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Email Address</Label>
              <Input
                type="email"
                className="rounded-xl"
                {...form.register("emailAddress", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Username</Label>
              <Input
                className="rounded-xl"
                {...form.register("userName", { required: true })}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-5 text-white font-semibold rounded-xl shadow-lg
              bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all"
            >
              {mutation.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
