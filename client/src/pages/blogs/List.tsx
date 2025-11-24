import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import BlogCard from "@/components/BlogCard";

type Blog = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  createdAt: string;
  user: { firstName: string; lastName: string };
};

async function fetchBlogs() {
  const { data } = await api.get("/blogs", { withCredentials: true });
  return data.blogs as Blog[];
}

export default function BlogList() {
  const { data, isLoading } = useQuery(["blogs"], fetchBlogs);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Blogs</h2>
        <Link to="/blogs/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create Blog
          </button>
        </Link>
      </div>
      <div className="grid gap-4">
        {data?.map((b) => (
          <BlogCard
            key={b.id}
            id={b.id}
            title={b.title}
            synopsis={b.synopsis}
            featuredImageUrl={b.featuredImageUrl}
            authorName={`${b.user.firstName} ${b.user.lastName}`}
            createdAt={b.createdAt}
            actions={
              <>
                <Link to={`/blogs/edit/${b.id}`}>
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Edit
                  </button>
                </Link>
                <Link to="/blogs/trash">
                  <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Trash
                  </button>
                </Link>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
