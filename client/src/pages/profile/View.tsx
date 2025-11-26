import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function ViewProfilePage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile", { withCredentials: true })).data,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading profile...
        </p>
      </div>
    );

  // Generate initials
  const initials = `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`
    .toUpperCase()
    .trim();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-xl shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 flex flex-col items-center text-white">

          {/* Avatar (Initials Only) */}
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarFallback className="text-3xl font-bold bg-white text-purple-700">
              {initials}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-4 text-3xl font-bold drop-shadow">
            {data.firstName} {data.lastName}
          </h1>
          <p className="text-sm mt-1 opacity-80">@{data.userName}</p>
        </div>

        {/* Content */}
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Email:</strong> {data.emailAddress}
            </p>
            <p className="text-gray-700">
              <strong>Username:</strong> {data.userName}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => navigate("/profile")}
            >
              Edit Profile
            </Button>

            <Button
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-400 text-white hover:opacity-90 transition-all"
              onClick={() => navigate("/profile")}
            >
              
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
