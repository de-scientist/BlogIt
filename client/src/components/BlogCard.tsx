import { ReactNode } from "react";

type BlogCardProps = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  authorName?: string;
  createdAt?: string;
  actions?: ReactNode; // Buttons or other actions
};

export default function BlogCard({
  id,
  title,
  synopsis,
  featuredImageUrl,
  authorName,
  createdAt,
  actions,
}: BlogCardProps) {
  return (
    <div key={id} className="p-4 border rounded shadow-sm">
      {featuredImageUrl && (
        <img
          src={featuredImageUrl}
          alt={title}
          className="w-full h-40 object-cover mb-2 rounded"
        />
      )}
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{synopsis}</p>
      {authorName && createdAt && (
        <p className="text-xs text-gray-500 mt-1">
          By {authorName} on {new Date(createdAt).toLocaleDateString()}
        </p>
      )}
      {actions && <div className="mt-2 flex gap-2">{actions}</div>}
    </div>
  );
}
