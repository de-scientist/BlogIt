import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../lib/axios";

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/blogs/${id}`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
    });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/blogs/${id}`, { title, content });
    router.push("/blogs/list");
  };

  return (
    <form onSubmit={submit} className="max-w-2xl">
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}
