"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const BlogFormObject = z.object({
  title: z
    .string()
    .max(100, { error: "Title cannot be longer than 100 characters" })
    .min(10, { error: "Title needs to be atleast 10 characters long" }),
  description: z
    .string()
    .max(250, {
      error: "The description cannot be longer than 250 characters",
    })
    .min(50, { error: "The description needs to be atleast 50 words long" }),
  content: z.string(),
  author: z.string(),
  hidden: z.boolean(),
  status: z.enum(["halted", "confirmed"]),
});

type BlogForm = z.infer<typeof BlogFormObject>;

const NewBlogForm = () => {
  const { user } = useUser();
  const userRecord = useQuery(api.functions.query.getUserStatus, {
    clerkUserId: user?.id ?? "skip",
  });
  const userPosts = useQuery(api.functions.query.getLastPostTime, { authorId: userRecord?.data?._id! });
  const blogRecord = useMutation(api.functions.mutations.addPost)
  const [count, setCount] = useState(0);

  const form = useForm<BlogForm>({
    resolver: zodResolver(BlogFormObject),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      author: "",
      hidden: false,
      status: "halted",
    },
  });

  useEffect(() => {
    if (userRecord?.status && userRecord.data) {
      form.setValue("author", userRecord.data._id);
    }
  }, [userRecord, form, count]);

  const handleSubmit = async (values: BlogForm) => {

    if (!userPosts?.canPost) {
      toast.error("You can only post once every 10 minutes. Please wait before creating another post.");
      return;
    }

    const result = await blogRecord(values);
    if (result.status) {
      toast.success("Blog post created successfully!");
      form.reset();
      setCount((prev) => prev + 1);
    } else {
      toast.error("There was an error creating the blog post.");
    }
  };

  if (userRecord === undefined || userPosts === undefined) {
    return (
      <div className="border p-4 rounded-xl max-w-5xl col-span-full lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-l-teal-400 pl-2">
          Create a new post
        </h2>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div >
    )
  }

  return (
    <div className="border p-4 rounded-xl max-w-5xl col-span-full lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-l-teal-400 pl-2">
        Create a new post
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-3 gap-4 my-4">
            <FormField
              name="author"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="hidden"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Keep this post hidden?
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Only admins can see hidden posts.
                    </p>
                  </div>
                </FormItem>
              )}
            />

          </div>

          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    required
                    placeholder="How GenZ might revolutionize the world?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    required
                    placeholder="Briefly describe what this post is about..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    required
                    placeholder="Write your blog post content here..."
                    className="min-h-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-4" disabled={userRecord?.data!.status === "pending"}>
            Create Post
          </Button>
        </form>
      </Form>
    </div >
  );
};

export default NewBlogForm;
