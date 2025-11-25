import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BlogList() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs", { withCredentials: true });
      return res.data.blogs;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-lg font-medium text-gray-500">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      {data.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600 mb-4">No blogs found.</p>
          <Link to="/blogs/create">
            <Button variant="default">Create your first blog</Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="h-[80vh]">
          <div className="grid gap-6 md:grid-cols-2">
            {data.map((blog: any) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <h2 className="text-lg font-semibold">{blog.title}</h2>
                  <p className="text-sm text-gray-500">{blog.synopsis}</p>
                </CardHeader>
                {blog.featuredImageUrl && (
                  <img
                    src={blog.featuredImageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-md mt-2"
                  />
                )}
                <CardContent>
                  <small className="text-gray-400">
                    By {blog.user.firstName} {blog.user.lastName} |{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </small>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Link to={`/blogs/edit/${blog.id}`}>
                    <Button variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600">
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/blogs/view/${blog.id}`}>
                    <Button variant="default">View</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
