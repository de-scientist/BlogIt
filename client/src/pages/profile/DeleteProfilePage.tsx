import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // 💡 IMPORT: Added Card components
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle, XCircle } from "lucide-react"; // 💡 IMPORT: Added icons

export default function DeleteProfilePage() {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await api.delete("/profile", { withCredentials: true });
      // 💡 FIX: Set toast position to bottom-left
      toast.success("Profile successfully moved to trash.", { position: "bottom-left" });
      navigate("/");
    } catch (error) {
      // 💡 FIX: Set toast position to bottom-left and improve error message
      const errorMessage = (error as any).response?.data?.message || "Could not delete profile due to an unknown error.";
      toast.error(errorMessage, { position: "bottom-left" });
    }
  };

  return (
    // 💡 ADJUSTED: Padding for Navbar (pt-16) and Sidebar (pl-4)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10 flex justify-center">

      <div className="max-w-lg w-full px-4 sm:px-0">
        
        {/* ---------------------------------- */}
        {/* HEADER AND CLEAR MESSAGE */}
        {/* ---------------------------------- */}
        <header className="py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
                <Trash2 className="w-8 h-8 mr-3 text-red-600" /> Account Deletion
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                This page handles the irreversible (or partially reversible) termination of your account data.
            </p>
            <hr className="mt-4 border-gray-200 dark:border-gray-700" />
        </header>

        {/* ---------------------------------- */}
        {/* WARNING/ACTION CARD */}
        {/* ---------------------------------- */}
        <Card className="shadow-2xl border-t-4 border-red-600 dark:bg-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6 mr-2" /> Confirmation Required
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            
            {/* 💡 NEW: Clear Messaging/Warning Banner */}
            <div className="flex p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-300 border border-red-200" role="alert">
                <XCircle className="flex-shrink-0 inline w-5 h-5 mr-3 mt-0.5" />
                <div>
                    <span className="font-medium">Important:</span> You are about to move your profile data to the trash. While this specific action is **reversible**, repeated or permanent deletion requests may result in loss of access.
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              By clicking the button below, your profile information, including user data and preferences, will be securely flagged for deletion and moved into the temporary holding (trash) area. You will be immediately logged out and redirected to the homepage.
            </p>

            {/* Delete Button */}
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mt-4 w-full py-3 text-lg font-semibold rounded-lg shadow-lg 
                         bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center"
            >
              <Trash2 className="w-5 h-5 mr-2" /> Move Profile to Trash
            </Button>

            {/* Alternative Action (Navigate Back) */}
            <Button
              variant="outline"
              onClick={() => navigate("/profile/view")}
              className="mt-2 w-full py-3 text-base font-medium rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              Cancel and Keep Profile
            </Button>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}