import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios"; 
import { LogOut, CheckCircle, XCircle } from "lucide-react"; // 💡 Added icons

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const navigate = useNavigate();

  // Mutation hook for the logout API call
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/auth/logout");
    },
    onSuccess: () => {
      // 💡 TOAST: Position bottom-left
      toast.success("You have been successfully logged out.", { position: "bottom-left" });
      // Redirect to the home page after successful logout
      navigate("/");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // 💡 TOAST: Position bottom-left for error
      toast.error("Logout failed. Please try again.", { position: "bottom-left" });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCancel = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  return (
    // 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center py-10">
      <Card className="w-full max-w-md shadow-2xl border-2 border-red-100 dark:border-slate-700 rounded-xl dark:bg-slate-800 p-6">
        <CardHeader className="text-center space-y-3">
            <LogOut className="w-10 h-10 mx-auto text-red-600 dark:text-red-400 mb-2" />
          <CardTitle className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
            Confirm Logout
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Are you sure you want to log out of your current session?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="mt-6 space-y-4">
          {/* Logout Button (Primary Action - Green/Teal for completion/success flow) */}
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full py-3 text-lg font-semibold rounded-xl 
                       bg-gradient-to-r from-green-500 to-teal-400 text-white 
                       hover:opacity-90 transition-all shadow-lg shadow-green-500/40"
          >
            {logoutMutation.isPending ? (
                <span className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 animate-pulse" /> Logging Out...
                </span>
            ) : (
                <span className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" /> Yes, Log Out
                </span>
            )}
          </Button>

          {/* Cancel Button (Secondary Action - Red/Pink for going back/canceling) */}
          <Button
            onClick={handleCancel}
            variant="outline" 
            disabled={logoutMutation.isPending}
            className="w-full py-3 text-lg font-semibold rounded-xl 
                       border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 
                       hover:bg-red-50 dark:hover:bg-slate-700 transition-all"
          >
                <XCircle className="w-5 h-5 mr-2" /> No, Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}