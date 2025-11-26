import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios"; 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const navigate = useNavigate();

  // Mutation hook for the logout API call
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Your server logic clears the cookie and returns a 200 status
      return await api.post("/auth/logout");
    },
    onSuccess: () => {
      toast.success("You have been logged out.");
      // Redirect to the home page after successful logout
      navigate("/");
    },
    onError: (error) => {
      // You can customize the error message based on the response
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    },
  });

  const handleLogout = () => {
    // Trigger the logout mutation
    logoutMutation.mutate();
  };

  const handleCancel = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-2xl border-gray-200 rounded-xl bg-white p-6">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Confirm Logout
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Are you sure you want to log out of your account?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="mt-6 space-y-4">
          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full py-3 text-lg font-semibold rounded-xl 
                       bg-gradient-to-r from-green-500 to-teal-400 text-white 
                       hover:opacity-90 transition-all shadow-lg"
          >
            {logoutMutation.isPending ? "Logging Out..." : "Yes, Log Out"}
          </Button>

          {/* Cancel Button */}
          <Button
            onClick={handleCancel}
            variant="ghost" // Use shadcn's ghost variant or customize directly
            disabled={logoutMutation.isPending}
            className="w-full py-3 text-lg font-semibold rounded-xl 
                       bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                       hover:opacity-90 transition-all shadow-lg"
          >
            No, Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}