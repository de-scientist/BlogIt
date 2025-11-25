import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BlogList() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs", { withCredentials: true });
      return Array.isArray(res.data.blogs) ? res.data.blogs : [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-lg font-medium text-gray-500 animate-pulse">
          Loading blogs...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-6">
      {data.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600 mb-4">No blogs yet.</p>
          <Link to="/blogs/create" rel="noopener">
            <Button>Create your first blog</Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="h-[82vh]">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Explore Stories
          </h1>

          {/* Pinterest-style grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
            {data.map((blog: any) => (
              <Card
                key={blog.id}
                className="rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 
                hover:shadow-2xl hover:-rotate-1 transition-all duration-300 border border-gray-200"
              >
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold">{blog.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{blog.synopsis}</p>
                </CardHeader>

                {blog.featuredImageUrl && (
                  <img
                    src={blog.featuredImageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}

                <CardContent className="pt-3">
                  <small className="text-gray-500">
                    By {blog.user.firstName} {blog.user.lastName} •{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </small>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                  <Link to={`/blogs/edit/${blog.id}`} rel="noopener">
                    <Button
                      variant="outline"
                      className="border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white"
                    >
                      Edit
                    </Button>
                  </Link>

                  <Link to={`/blogs/view/${blog.id}`} rel="noopener">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      View
                    </Button>
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
