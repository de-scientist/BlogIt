import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function DeleteProfilePage() {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await api.delete("/profile", { withCredentials: true });
      toast.success("Profile moved to trash.");
      navigate("/");
    } catch {
      toast.error("Could not delete profile.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold text-red-600">Delete Profile</h1>
        <p className="mt-2 text-gray-600">
          This action is reversible. Your profile will be moved to trash.
        </p>

        <Button
          variant="destructive"
          onClick={handleDelete}
          className="mt-6 w-full"
        >
          Move Profile to Trash
        </Button>
      </div>
    </div>
  );
}
