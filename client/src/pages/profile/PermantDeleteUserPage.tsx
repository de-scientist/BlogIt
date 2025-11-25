import { api } from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PermanentDeleteUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePermanentDelete = async () => {
    try {
      await api.delete(`/users/delete/${id}`, {
        withCredentials: true,
      });

      toast.success("User permanently deleted.");
      navigate("/");
    } catch (err) {
      toast.error("Could not delete user.");
    }
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold text-red-700">Permanent Deletion</h1>
      <p>This cannot be undone. All data will be destroyed forever.</p>

      <Button variant="destructive" onClick={handlePermanentDelete}>
        Permanently Delete User
      </Button>
    </div>
  );
}
