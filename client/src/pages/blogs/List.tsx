import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import Link from "next/link";

async function fetchBlogs() {
  const { data } = await api.get("/blogs");
  return data;
}

export default function List() {
  const { data, isLoading } = useQuery(["blogs"], fetchBlogs);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl">All blogs</h2>
        <Link href="/blogs/new">
          <a>Create</a>
        </Link>
      </div>
      <div className="grid gap-4 mt-6">
        {data?.map((b: any) => (
          <div key={b.id} className="p-4 border rounded">
            <h3 className="font-bold">{b.title}</h3>
            <p className="text-sm">{b.excerpt}</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/blogs/edit/${b.id}`}>
                <a>Edit</a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
