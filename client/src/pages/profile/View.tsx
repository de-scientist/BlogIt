import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile", { withCredentials: true })).data,
  });

  if (isLoading) return <p className="p-10 text-gray-500">Loading...</p>;

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-xl shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 font-semibold">
            User Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-700">
          <p>
            <strong>First Name:</strong> {data.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {data.lastName}
          </p>
          <p>
            <strong>Email:</strong> {data.emailAddress}
          </p>
          <p>
            <strong>Username:</strong> {data.userName}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
