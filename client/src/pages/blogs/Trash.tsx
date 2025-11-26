import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Trash() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await api.get("/blogs/trash", { withCredentials: true });
      return res.data.blogs;
    },
  });

  const recoverMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Recovered!");
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/blogs/permanent/${id}`, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Deleted permanently");
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;

  if (data.length === 0)
    return <p className="text-center p-8">Your trash is empty.</p>;

  return (
    <ScrollArea className="max-w-4xl mx-auto mt-8 space-y-4 h-[70vh]">
      {data.map((blog: any) => (
        <Card
          key={blog.id}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader>
            <h2 className="font-bold text-lg">{blog.title}</h2>
            <small className="text-gray-400">
              {new Date(
                blog.lastUpdated || blog.createdAt,
              ).toLocaleDateString()}
            </small>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2">
            <Button
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={() => recoverMutation.mutate(blog.id)}
            >
              Recover
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteMutation.mutate(blog.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </ScrollArea>
  );
}
