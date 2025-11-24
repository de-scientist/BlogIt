import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";

// ---------------------
// Form type
// ---------------------
type BlogForm = {
  title: string;
  content: string;
};

// ---------------------
// Field component
// ---------------------
type FieldProps = {
  label?: string;
  error?: FieldErrors<BlogForm>[keyof BlogForm];
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      {label && <p className="font-medium">{label}</p>}
      {children}
      {error?.message && <p className="text-red-500 text-sm">{error.message as string}</p>}
    </div>
  );
}

// ---------------------
// Component
// ---------------------
export default function CreateBlogPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<BlogForm>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleSubmit = async (data: BlogForm) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/blogs", data, { withCredentials: true });
      toast.success("Blog created");
      form.reset();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach((key) => {
          form.setError(key as keyof BlogForm, {
            type: "server",
            message: errors[key],
          });
        });
      } else {
        toast.error("Error creating blog");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Blog</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {loading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : (
              <>
                <Field error={form.formState.errors.title}>
                  <Input placeholder="Blog title" {...form.register("title")} />
                </Field>

                <Field error={form.formState.errors.content}>
                  <Textarea placeholder="Write something..." className="min-h-[150px]" {...form.register("content")} />
                </Field>

                <Button type="submit" disabled={loading}>
                  Publish
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
