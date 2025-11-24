import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { toast } from "sonner";

type BlogForm = {
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  content: string;
};

export default function CreateBlog() {
  const navigate = useNavigate();
  const form = useForm<BlogForm>({ defaultValues: { title: "", synopsis: "", content: "" } });
  const loading = form.formState.isSubmitting;

  const onSubmit = async (data: BlogForm) => {
    try {
      await api.post("/blogs", data, { withCredentials: true });
      toast.success("Blog created successfully");
      navigate("/blogs");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input placeholder="Title" {...form.register("title")} className="w-full border p-2 rounded" />
      <input placeholder="Synopsis" {...form.register("synopsis")} className="w-full border p-2 rounded" />
      <input placeholder="Featured Image URL" {...form.register("featuredImageUrl")} className="w-full border p-2 rounded" />
      <textarea placeholder="Content" {...form.register("content")} className="w-full border p-2 rounded h-40" />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Create
      </button>
    </form>
  );
}
