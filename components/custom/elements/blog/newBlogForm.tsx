"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import {
  Clock,
  EyeOff,
  Loader2,
  PenTool,
  Settings2,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const BlogFormObject = z.object({
  title: z
    .string()
    .max(100, { message: "Title cannot be longer than 100 characters" })
    .min(10, { message: "Title needs to be at least 10 characters long" }),
  description: z
    .string()
    .max(350, {
      message: "The description cannot be longer than 350 characters",
    })
    .min(50, {
      message: "The description needs to be at least 50 characters long",
    }),
  content: z.string().min(10, { message: "Content is too short" }),
  author: z.string(),
  hidden: z.boolean(),
  status: z.enum(["halted", "public"]),
});

type BlogForm = z.infer<typeof BlogFormObject>;

const NewBlogForm = () => {
  const { user } = useUser();
  const userRecord = useQuery(api.functions.query.getUserStatus, {
    clerkUserId: user?.id ?? "skip",
  });
  const userPosts = useQuery(
    api.functions.query.getLastPostTime,
    userRecord?.data?._id ? { authorId: userRecord.data._id } : "skip",
  );
  const blogRecord = useMutation(api.functions.mutations.addPost);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");

  useEffect(() => {
    if (userRecord?.status && userRecord.data) {
      form.setValue("author", userRecord.data._id);
    }
  }, [userRecord, form]);

  const handleSubmit = async (values: BlogForm) => {
    if (!userPosts?.canPost) {
      toast.error(
        "You can only post once every 10 minutes. Please wait before creating another post.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await blogRecord({
        ...values,
        author: values.author as Id<"users">,
      });
      if (result.status) {
        toast.success("Blog post created successfully!");
        form.reset({
          ...form.getValues(),
          title: "",
          description: "",
          content: "",
          hidden: false,
        });
      } else {
        toast.error("There was an error creating the blog post.");
      }
    } catch (error) {
      console.error(
        `Error occured while creating the post: ${(error as Error).message}`,
      );
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRecord === undefined || userPosts === undefined) {
    return (
      <div className="border p-6 rounded-xl max-w-5xl col-span-full lg:col-span-2 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="border p-6 rounded-xl max-w-5xl col-span-full lg:col-span-2 bg-card shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-teal-500/10 p-2 rounded-lg">
            <PenTool className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create a new post
          </h2>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-full border">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Posting as{" "}
            <span className="text-primary">
              {user?.fullName || "Anonymous"}
            </span>
          </span>
          <Separator orientation="vertical" className="h-4" />
          <Badge
            variant={
              userRecord.data?.status === "active" ? "default" : "secondary"
            }
            className="text-[10px] uppercase tracking-wider h-5"
          >
            {userRecord.data?.status || "Pending"}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Content Details
              </span>
            </div>

            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-end">
                    <FormLabel>Title</FormLabel>
                    <span
                      className={`text-[10px] font-mono ${titleValue.length > 100 || (titleValue.length < 10 && titleValue.length > 0) ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {titleValue.length}/100
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="e.g. The Future of Web Development in 2026"
                      className="text-lg font-medium"
                    />
                  </FormControl>
                  <FormDescription>
                    Catchy titles help your post stand out. (Min 10 chars)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-end">
                    <FormLabel>Short Description</FormLabel>
                    <span
                      className={`text-[10px] font-mono ${descriptionValue.length > 350 || (descriptionValue.length < 50 && descriptionValue.length > 0) ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {descriptionValue.length}/350
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Briefly summarize your post for the feed..."
                      className="resize-none h-24"
                    />
                  </FormControl>
                  <FormDescription>
                    This appears on the main feed. (Min 50 chars)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell your story..."
                      className="min-h-75 leading-relaxed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Settings2 className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Post Settings
              </span>
            </div>

            <FormField
              name="hidden"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                      <FormLabel className="text-base cursor-pointer">
                        Private Post
                      </FormLabel>
                    </div>
                    <FormDescription>
                      Only administrators will be able to view this post.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {!userPosts?.canPost && (
            <Alert
              variant="destructive"
              className="bg-destructive/5 border-destructive/20 text-destructive"
            >
              <Clock className="h-4 w-4" />
              <AlertTitle>Posting Cooldown</AlertTitle>
              <AlertDescription className="text-xs opacity-90">
                You recently created a post. To prevent spam, there is a
                10-minute cooldown between posts.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full transition-all active:scale-[0.98]"
            disabled={
              userRecord?.data?.status === "pending" ||
              !userPosts?.canPost ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewBlogForm;
