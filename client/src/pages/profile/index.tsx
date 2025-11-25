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

  if (data && !isLoading) form.reset(data);

  const mutation = useMutation({
    mutationFn: async (payload: ProfileForm) =>
      (await api.patch("/api/profile", payload, { withCredentials: true })).data,
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
              <Input {...form.register("firstName")} />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input {...form.register("lastName")} />
            </div>

            <div>
              <Label>Email</Label>
              <Input {...form.register("emailAddress")} />
            </div>

            <div>
              <Label>Username</Label>
              <Input {...form.register("userName")} />
            </div>

            <Button type="submit">{mutation.isLoading ? "Saving..." : "Save"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
