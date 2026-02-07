"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  ArrowUpDown,
  BookOpen,
  Clock,
  Search,
  Share2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

const AllPostsFeed = () => {
  const posts = useQuery(api.functions.query.GetAllPostsWithUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("public");

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    let result = posts.filter((post) => !post.hidden);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((post) => post.status === filterStatus);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return b._creationTime - a._creationTime;
      if (sortBy === "oldest") return a._creationTime - b._creationTime;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [posts, searchQuery, sortBy, filterStatus]);

  if (posts === undefined) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <Skeleton className="h-10 w-full md:w-40" />
          <Skeleton className="h-10 w-full md:w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div
        className={cn(
          "flex flex-col lg:flex-row gap-4 mb-8 sticky top-20 z-10",
          "bg-background/70 backdrop-blur-md border border-border/60",
          "p-3 rounded-2xl shadow-sm",
        )}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className={cn(
              "pl-10 rounded-full text-sm",
              "bg-background/70 border-border/70",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className={cn(
                "w-full md:w-40 rounded-full text-sm",
                "bg-background/70 border-border/70",
              )}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger
              className={cn(
                "w-full md:w-40 rounded-full text-sm",
                "bg-background/70 border-border/70",
              )}
            >
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="halted">Halted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No posts found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPosts.map((post) => (
            <Dialog key={post._id}>
              <DialogTrigger asChild>
                <Card
                  className={cn(
                    "flex flex-col cursor-pointer group rounded-2xl border-border/60",
                    "bg-card/80 p-6 shadow-sm transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-lg",
                  )}
                >
                    <CardHeader className="p-0 space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 border border-border/70">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.name || post._id}`}
                            />
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {post.user?.name || "Anonymous"}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] uppercase tracking-[0.2em]",
                            "font-semibold bg-muted/60",
                          )}
                        >
                          {calculateReadingTime(post.content)}
                        </Badge>
                      </div>
                      <CardTitle
                        className={cn(
                          "line-clamp-2 leading-tight text-xl md:text-2xl",
                          "font-display tracking-tight",
                          "group-hover:text-primary transition-colors",
                        )}
                      >
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 pt-4">
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </CardContent>
                    <CardFooter
                      className={cn(
                        "p-0 pt-6 text-xs text-muted-foreground",
                        "flex justify-between items-center",
                      )}
                    >
                      <div className="flex items-center gap-1.5 uppercase tracking-[0.2em]">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(post._creationTime).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-full opacity-0",
                            "group-hover:opacity-100 transition-opacity",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              `${window.location.origin}/post/${post._id}`,
                            );
                          }}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                        <div
                          className={cn(
                            "flex items-center gap-1 text-primary font-medium",
                            "opacity-0 group-hover:opacity-100 transition-all",
                            "translate-x-2 group-hover:translate-x-0",
                          )}
                        >
                          <span className="text-[11px] uppercase tracking-[0.2em]">
                            Read
                          </span>
                          <BookOpen className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent
                  className={cn(
                    "scroll-smooth overflow-y-auto p-0 gap-0 border-none",
                    "shadow-2xl sm:max-w-4xl rounded-3xl",
                  )}
                >
                  <DialogTitle className="sr-only">{post.title}</DialogTitle>
                  <div
                    className={cn(
                      "relative h-56 md:h-64 w-full border-b",
                      "bg-linear-to-br from-primary/15 via-background/5 to-background",
                    )}
                  >
                    <div className="absolute inset-0 bg-editorial-grid opacity-40" />
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 p-8 space-y-4",
                        "bg-linear-to-t from-background via-background/70 to-transparent",
                      )}
                    >
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={cn(
                            "bg-primary/10 text-primary hover:bg-primary/20 border-none",
                            "px-3 py-1 uppercase tracking-[0.3em] text-[10px] font-semibold",
                          )}
                        >
                          {post.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="backdrop-blur-sm border-muted-foreground/20 text-xs"
                        >
                          {new Date(post._creationTime).toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-12">
                    <header className="py-8 border-b border-muted/30 mb-8">
                      <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-display leading-tight tracking-tight mb-6">
                          {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.name || post._id}`}
                              />
                              <AvatarFallback>
                                <User />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-lg">
                                {post.user?.name || "Anonymous Author"}
                              </p>
                              <p
                                className={cn(
                                  "text-xs text-muted-foreground flex items-center gap-1",
                                  "uppercase tracking-[0.2em]",
                                )}
                              >
                                <Clock className="h-3 w-3" />
                                {calculateReadingTime(post.content)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>

                    <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto">
                      <p
                        className={cn(
                          "text-xl text-muted-foreground font-medium leading-relaxed italic",
                          "border-l-4 border-primary/30 pl-6 mb-10",
                        )}
                      >
                        {post.description}
                      </p>
                      <div className="text-foreground leading-relaxed whitespace-pre-wrap text-lg font-normal">
                        {post.content}
                      </div>
                    </div>

                    <hr className="mt-8" />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
        </div>
      )}
    </div>
  );
};

export default AllPostsFeed;
