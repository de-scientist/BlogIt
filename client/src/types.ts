// types.ts
export type Blog = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  content?: string;
  createdAt: string;
  lastUpdated?: string;
  user: {
    firstName: string;
    lastName: string;
  };
};
