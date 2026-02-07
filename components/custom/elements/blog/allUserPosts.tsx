"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const AllPostsUser = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<Id<"blogs"> | null>(null);
  const [togglingId, setTogglingId] = useState<Id<"blogs"> | null>(null);

  const userRecord = useQuery(api.functions.query.getUserStatus, {
    clerkUserId: user?.id ?? "skip",
  });

  const postRecords = useQuery(
    api.functions.query.getAllPostsOfUser,
    userRecord?.data?._id ? { authorId: userRecord.data._id } : "skip",
  );

  const deletePost = useMutation(api.functions.mutations.deletePost);
  const togglePostVis = useMutation(
    api.functions.mutations.togglePostVisibility,
  );

  const filteredPosts = useMemo(() => {
    if (!postRecords) return [];
    return postRecords.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [postRecords, searchQuery]);

  const handleToggleVisibility = async (id: Id<"blogs">, hidden: boolean) => {
    setTogglingId(id);
    try {
      await togglePostVis({ id, hidden });
      toast.success(hidden ? "Post is now hidden" : "Post is now public");
    } catch (error) {
      console.error(
        `Error occured while toggling post visibility: ${(error as Error).message}`,
      );
      toast.error("Failed to update visibility");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: Id<"blogs">) => {
    setDeletingId(id);
    try {
      await deletePost({ id });
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error(
        `Error occured while deleting post: ${(error as Error).message}`,
      );
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  if (postRecords === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (postRecords?.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center space-y-4",
          "border border-dashed rounded-2xl bg-muted/20",
        )}
      >
        <div className="bg-[var(--accent-warm-muted)] p-4 rounded-full border border-border/60">
          <FileText className="h-7 w-7 text-[color:var(--accent-warm)]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg tracking-tight font-display">
            No posts yet
          </h3>
          <p className="text-muted-foreground text-xs max-w-52 mx-auto">
            Share your first story with the community!
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Plus className="mr-2 h-3 w-3" />
          Create Post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter your posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "pl-10 rounded-full text-sm",
            "bg-background/70 border-border/70",
            "focus-visible:ring-primary/40",
          )}
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-12 text-center",
            "border border-dashed rounded-2xl bg-card/50",
          )}
        >
          <Search className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm font-bold">No matches</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="mt-1 h-auto p-0"
          >
            Clear
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card
              key={post._id}
              className={cn(
                "group flex flex-col rounded-2xl border-border/60",
                "hover:border-primary/40 transition-all duration-300",
                "shadow-sm hover:shadow-md bg-card/80 overflow-hidden",
              )}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start mb-2 text-xs text-muted-foreground">
                  <Badge
                    variant={post.hidden ? "outline" : "default"}
                    className={cn(
                      "text-[9px] h-4 px-2 uppercase tracking-[0.2em]",
                      post.hidden
                        ? "bg-amber-500/10 text-amber-600 border-amber-200/50"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
                    )}
                  >
                    {post.hidden ? "Hidden" : "Public"}
                  </Badge>
                  <span className="text-[10px] flex items-center gap-1 uppercase tracking-[0.2em]">
                    <Clock className="h-2.5 w-2.5" />
                    {formatDistanceToNow(new Date(post._creationTime), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <CardTitle
                  className={cn(
                    "text-base font-semibold line-clamp-1 font-display",
                    "group-hover:text-primary transition-colors",
                  )}
                >
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <CardDescription
                  className={cn(
                    "line-clamp-2 text-xs mb-4",
                    "text-muted-foreground/90",
                  )}
                >
                  {post.description}
                </CardDescription>

                <div className="flex items-center gap-2">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 h-8 text-xs font-semibold rounded-full"
                      >
                        View
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[95vh]">
                      <div className="mx-auto w-full max-w-4xl overflow-y-auto scrollbar-hide">
                        <DrawerHeader
                          className={cn(
                            "text-left border-b bg-background/90 pb-8",
                            "sticky top-0 backdrop-blur-md z-10",
                          )}
                        >
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge
                              variant={post.hidden ? "outline" : "default"}
                              className="px-3 py-1"
                            >
                              {post.hidden ? "Hidden Post" : "Publicly Visible"}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="px-3 py-1 uppercase"
                            >
                              {post.status}
                            </Badge>
                            <span
                              className={cn(
                                "text-xs text-muted-foreground flex items-center gap-2 ml-auto",
                                "bg-muted/60 px-3 py-1 rounded-full",
                              )}
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(post._creationTime).toLocaleDateString(
                                undefined,
                                { dateStyle: "long" },
                              )}
                            </span>
                          </div>
                          <DrawerTitle
                            className={cn(
                              "text-4xl md:text-5xl font-extrabold tracking-tight",
                              "leading-[1.1] font-display",
                            )}
                          >
                            {post.title}
                          </DrawerTitle>
                          <DrawerDescription
                            className={cn(
                              "text-lg md:text-xl mt-6 text-foreground/70 font-medium",
                              "leading-relaxed max-w-3xl border-l-4 border-primary/20 pl-6",
                            )}
                          >
                            {post.description}
                          </DrawerDescription>
                        </DrawerHeader>

                        <div className="p-8 md:p-12 pb-20">
                          <article className="max-w-none">
                            <div
                              className={cn(
                                "whitespace-pre-wrap leading-[1.8]",
                                "text-base md:text-lg text-foreground/90 font-serif",
                              )}
                            >
                              {post.content}
                            </div>
                          </article>
                        </div>

                        <DrawerFooter
                          className={cn(
                            "border-t bg-card/90 backdrop-blur-sm pt-8",
                            "sticky bottom-0 z-10",
                          )}
                        >
                          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto w-full">
                            <Button
                              variant="outline"
                              size="lg"
                              className={cn(
                                "flex-1 font-semibold h-12 shadow-sm rounded-full",
                              )}
                              disabled={togglingId === post._id}
                              onClick={() =>
                                handleToggleVisibility(post._id, !post.hidden)
                              }
                            >
                              {togglingId === post._id ? (
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              ) : post.hidden ? (
                                <>
                                  <Eye className="mr-2 h-5 w-5 text-emerald-500" />{" "}
                                  Restore to Public
                                </>
                              ) : (
                                <>
                                  <EyeOff className="mr-2 h-5 w-5 text-amber-500" />{" "}
                                  Hide from Public
                                </>
                              )}
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                              variant="destructive"
                              size="lg"
                              className="flex-1 font-semibold h-12 shadow-sm rounded-full"
                              disabled={deletingId === post._id}
                            >
                                  {deletingId === post._id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2 h-5 w-5" />{" "}
                                      Permanently Delete
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl border-2">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-2xl font-bold">
                                    Delete this masterpiece?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-base mt-2">
                                    This action is irreversible. The post{" "}
                                    <span
                                      className={cn(
                                        "font-bold text-foreground underline",
                                        "decoration-destructive/30 decoration-2",
                                      )}
                                    >
                                      &quot;{post.title}&quot;
                                    </span>{" "}
                                    and all its metadata will be purged from our
                                    systems.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-6 gap-3">
                                  <AlertDialogCancel className="font-semibold rounded-xl">
                                    Keep my post
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(post._id)}
                                    className={cn(
                                      "bg-destructive text-destructive-foreground",
                                      "hover:bg-destructive/90 font-bold px-6 rounded-xl",
                                    )}
                                  >
                                    Yes, Delete it
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full text-muted-foreground",
                        "hover:text-primary hover:bg-primary/5",
                      )}
                      disabled={togglingId === post._id}
                      onClick={() =>
                        handleToggleVisibility(post._id, !post.hidden)
                      }
                    >
                      {togglingId === post._id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : post.hidden ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-full text-muted-foreground",
                            "hover:text-destructive hover:bg-destructive/5",
                          )}
                          disabled={deletingId === post._id}
                        >
                          {deletingId === post._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-sm font-bold">
                            Delete post?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="h-8 text-xs">
                            No
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 text-xs"
                          >
                            Yes
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-[10px] text-center text-muted-foreground pt-2">
        {filteredPosts.length} of {postRecords.length} stories
      </p>
    </div>
  );
};

export default AllPostsUser;
