import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


const profileSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  emailAddress: z.string().email("Invalid email"),
  userName: z.string().min(3, "Username must have at least 3 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;


export default function ProfilePage() {
  const queryClient = useQueryClient();

  // Fetch profile
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await axios.get("/api/auth/me", { withCredentials: true })).data,
  });

  // Form
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: data || {
      firstName: "",
      lastName: "",
      emailAddress: "",
      userName: "",
    },
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: async (payload: ProfileForm) =>
      await axios.patch("/api/auth/update", payload, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Update failed"),
  });

  // Loading skeleton
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
        <CardContent className="space-y-4">
          <form
            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
            className="space-y-4"
          >
            <div>
              <Label>First Name</Label>
              <Input {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label>Last Name</Label>
              <Input {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input {...form.register("emailAddress")} />
              {form.formState.errors.emailAddress && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.emailAddress.message}
                </p>
              )}
            </div>

            <div>
              <Label>Username</Label>
              <Input {...form.register("userName")} />
              {form.formState.errors.userName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.userName.message}
                </p>
              )}
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
