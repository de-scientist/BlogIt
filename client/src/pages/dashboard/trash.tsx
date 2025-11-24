import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrashPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => (await axios.get("/api/blogs/trash")).data,
  });

  const recover = useMutation({
    mutationFn: async (id: string) =>
      await axios.patch(`/api/blogs/recover/${id}`),
    onSuccess: () => window.location.reload(),
  });

  return (
    <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))
      ) : data?.length === 0 ? (
        <p>No deleted blogs.</p>
      ) : (
        data.map((blog: any) => (
          <Card key={blog.id}>
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{blog.content}</p>
              <Button className="mt-4" onClick={() => recover.mutate(blog.id)}>
                Recover
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
