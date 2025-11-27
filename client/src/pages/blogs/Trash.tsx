import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// 💡 FIX: ADD useState HERE
import { useNavigate, Link } from "react-router-dom";
import { Wrench, PlusCircle, Lightbulb, CornerUpLeft } from "lucide-react"; 
import { useState } from "react"; 

// 💡 Simple list of fun facts
// ... (rest of the file follows)

// 💡 Simple list of fun facts
const facts = [
  "Did you know: Blog is a shortened version of 'weblog'?",
  "A single deleted file can remain recoverable on a hard drive for years!",
  "The first true weblog was arguably created in 1994 by Justin Hall.",
  "Deleting items to the trash folder does not free up storage space until you empty it.",
];
// Function to get a random fact
const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

export default function Trash() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentFact, setCurrentFact] = useState(getRandomFact()); // 💡 State for the interactive fact

  const { data = [], isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await api.get("/blogs/trash", { withCredentials: true });
      return res.data.blogs;
    },
  });

  const recoverMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog recovered successfully!");
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/blogs/permanent/${id}`, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog deleted permanently.");
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  if (isLoading) return <div className="p-4 text-center">Loading deleted blogs...</div>;

  if (data.length === 0)
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-2xl text-center border-t-4 border-purple-500">
        <div className="mb-6">
          <Wrench className="w-12 h-12 mx-auto text-purple-500" />
          <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Trash Bin is Empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            It looks like all your temporary deletions have been recovered or permanently removed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold hover:opacity-90 transition-all shadow-md shadow-green-500/30"
          >
            <Link to="/blogs/create">
              <PlusCircle className="w-5 h-5 mr-2" /> Start a New Blog
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <Link to="/dashboard">
              <CornerUpLeft className="w-5 h-5 mr-2" /> Go to Dashboard
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <Link to="/inspiration">
              <Lightbulb className="w-5 h-5 mr-2" /> Find Inspiration
            </Link>
          </Button>
        </div>

        {/* Interactive Fact */}
        <div 
          className="mt-6 p-4 bg-purple-50 dark:bg-slate-700 border border-purple-200 dark:border-purple-800 rounded-lg cursor-pointer transition hover:bg-purple-100 dark:hover:bg-slate-600"
          onClick={() => setCurrentFact(getRandomFact())} // Change fact on click
          title="Click to see another fact"
        >
          <p className="font-semibold text-purple-800 dark:text-purple-300">
            {currentFact}
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
        <Wrench className="w-8 h-8 inline-block mr-2" /> Deleted Blogs
      </h2>
      <ScrollArea className="space-y-4 h-[70vh] p-4 border rounded-lg dark:border-slate-700 bg-white dark:bg-slate-800">
        {data.map((blog: any) => (
          <Card
            key={blog.id}
            className="hover:shadow-lg transition-shadow duration-200 dark:bg-slate-900 border-l-4 border-red-500"
          >
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <h2 className="font-bold text-xl">{blog.title}</h2>
                <small className="text-gray-500 dark:text-gray-400">
                  Deleted:{" "}
                  {new Date(
                    blog.lastUpdated || blog.createdAt,
                  ).toLocaleDateString()}
                </small>
              </div>
              <p className="text-sm text-red-500 font-medium mt-1">
                Awaiting Deletion
              </p>
            </CardHeader>
            <CardFooter className="flex justify-end gap-3">
              <Button
                className="bg-gradient-to-r from-green-500 to-teal-400 text-white hover:opacity-90 shadow-md shadow-green-500/30"
                onClick={() => recoverMutation.mutate(blog.id)}
                disabled={recoverMutation.isPending}
              >
                {recoverMutation.isPending ? "Recovering..." : "Recover"}
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/30"
                onClick={() => deleteMutation.mutate(blog.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}