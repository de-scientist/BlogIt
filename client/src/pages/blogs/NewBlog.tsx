import { useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/router";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/blogs", { title, content });
      router.push("/blogs/list");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button type="submit">Create</button>
    </form>
  );
}
