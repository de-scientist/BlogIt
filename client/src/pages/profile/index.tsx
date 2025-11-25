import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

  // FETCH USER PROFILE
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await axios.get("/api/profile", { withCredentials: true })).data,
  });

  const form = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      userName: "",
    },
  });

  // Sync fetched data into form
  if (data && !isLoading) {
    form.reset(data);
  }

  // UPDATE PROFILE
  const mutation = useMutation({
    mutationFn: async (payload: ProfileForm) =>
      (await axios.patch("/api/profile", payload, { withCredentials: true }))
        .data,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate("/dashboard"); // redirect to blog dashboard
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  if (isLoading) {
    return (
      <div className="p-10 space-y-4">
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

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
              <Input {...form.register("firstName", { required: true })} />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input {...form.register("lastName", { required: true })} />
            </div>

            <div>
              <Label>Email</Label>
              <Input {...form.register("emailAddress", { required: true })} />
            </div>

            <div>
              <Label>Username</Label>
              <Input {...form.register("userName", { required: true })} />
            </div>

            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
