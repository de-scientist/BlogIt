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
      (
        await api.patch(
          "/profile",
          { ...payload },
          { withCredentials: true }
        )
      ).data,
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
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-xl shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Update Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-5"
          >
            <div>
              <Label>First Name</Label>
              <Input {...form.register("firstName", { required: true })} />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input {...form.register("lastName", { required: true })} />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                {...form.register("emailAddress", { required: true })}
                type="email"
              />
            </div>

            <div>
              <Label>Username</Label>
              <Input {...form.register("userName", { required: true })} />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {mutation.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
