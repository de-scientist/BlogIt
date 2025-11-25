import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";

export default function BlogList() {
  const { data, isLoading } = useQuery(["blogs"], async () => (await api.get("/blogs", { withCredentials: true })).data.blogs);

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {data.length === 0 ? (
        <p>No blogs found. <Link to="/blogs/create" className="text-blue-500">Create one</Link></p>
      ) : (
        data.map((blog: any) => (
          <div key={blog.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">{blog.title}</h2>
              <p>{blog.synopsis}</p>
              <small>By {blog.user.firstName} {blog.user.lastName} | {new Date(blog.createdAt).toLocaleDateString()}</small>
            </div>
            <div className="space-x-2">
              <Link to={`/blogs/edit/${blog.id}`} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</Link>
              <Link to={`/blogs/view/${blog.id}`} className="px-2 py-1 bg-blue-500 text-white rounded">View</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
