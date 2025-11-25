import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await axios.get("/api/profile", { withCredentials: true })).data,
  });

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p><strong>First Name:</strong> {data.firstName}</p>
          <p><strong>Last Name:</strong> {data.lastName}</p>
          <p><strong>Email:</strong> {data.emailAddress}</p>
          <p><strong>Username:</strong> {data.userName}</p>
        </CardContent>
      </Card>
    </div>
  );
}
