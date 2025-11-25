import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
  });

  // Ensure data is always an array
  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-semibold">Your Blogs</h1>
        <Link to="/dashboard/blogs">
          <Button>Create New</Button>
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading && blogs.length === 0 && (
        <p className="text-center text-gray-500">You have no blogs yet.</p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {blogs.map((blog: any) => (
          <Card key={blog.id}>
            <CardContent className="p-4">
              <h3 className="text-xl font-medium">{blog.title}</h3>
              <p className="text-gray-600 line-clamp-2">{blog.content}</p>

              <div className="flex gap-3 mt-4">
                <Link to={`/dashboard/edit/${blog.id}`}>
                  <Button size="sm">Edit</Button>
                </Link>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
