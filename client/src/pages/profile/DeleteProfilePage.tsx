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
    } catch (err: any) {
      toast.error("Could not delete profile.");
    }
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold text-red-600">Delete Profile</h1>
      <p>This action is reversible. Your profile will move to trash.</p>

      <Button variant="destructive" onClick={handleDelete}>
        Move Profile to Trash
      </Button>
    </div>
  );
}
