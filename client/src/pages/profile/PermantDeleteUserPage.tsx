import { api } from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PermanentDeleteUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePermanentDelete = async () => {
    try {
      await api.delete(`/users/delete/${id}`, { withCredentials: true });
      toast.success("User permanently deleted.");
      navigate("/");
    } catch {
      toast.error("Could not delete user.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-md border">
        <h1 className="text-3xl font-bold text-red-700">Permanent Deletion</h1>
        <p className="mt-3 text-gray-600">
          This action cannot be undone. All data will be permanently removed.
        </p>

        <Button
          variant="destructive"
          onClick={handlePermanentDelete}
          className="mt-6 w-full"
        >
          Permanently Delete User
        </Button>
      </div>
    </div>
  );
}
