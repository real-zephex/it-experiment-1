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
  const [filterStatus, setFilterStatus] = useState("all");

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    let result = [...posts];

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
      <div className="container mx-auto p-6 space-y-6">
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-2 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40">
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
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
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
          {filteredAndSortedPosts
            .filter((i) => !i.hidden && i.status.toLowerCase() === "public")
            .map((post) => (
              <Dialog key={post._id}>
                <DialogTrigger asChild>
                  <Card className="flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 bg-card border-muted-foreground/10 overflow-hidden">
                    <div className="h-2 w-full bg-linear-to-r from-primary/50 to-primary" />
                    <CardHeader className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.name || post._id}`}
                            />
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-muted-foreground">
                            {post.user?.name || "Anonymous"}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase tracking-wider font-bold bg-muted/50"
                        >
                          {calculateReadingTime(post.content)}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 leading-tight group-hover:text-primary transition-colors text-xl font-bold tracking-tight">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground border-t bg-muted/5 pt-4 pb-4 flex justify-between items-center px-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(post._creationTime).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              `${window.location.origin}/post/${post._id}`,
                            );
                          }}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <span className="text-[11px] uppercase tracking-tighter">
                            Read
                          </span>
                          <BookOpen className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent className="scroll-smooth overflow-y-auto p-0 gap-0 border-none shadow-2xl">
                  <DialogTitle className="sr-only">{post.title}</DialogTitle>
                  <div className="relative h-60 w-full bg-linear-to-br from-primary/20 via-primary/5 to-background border-b">
                    <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4 bg-linear-to-t from-background to-transparent">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 uppercase tracking-widest text-[10px] font-black">
                          {post.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="backdrop-blur-sm border-muted-foreground/20"
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
                     <header className="py-8 border-b border-muted/30 mb-8 sticky z-10 top-0 bg-background/90 backdrop-blur-md">
                      <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
                        {post.title}
                      </h1>
                      <div className="flex items-center justify-between">
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
                            <p className="font-bold text-lg">
                              {post.user?.name || "Anonymous Author"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />{" "}
                              {calculateReadingTime(post.content)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </header>

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary/30 pl-6 mb-10">
                        {post.description}
                      </p>
                      <div className="text-foreground leading-extra-relaxed whitespace-pre-wrap text-lg font-normal">
                        {post.content}
                      </div>
                    </div>

                    {/*<footer className="mt-16 pt-8 border-t border-muted/30 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                          Share this article:
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" className="gap-2 group">
                        Back to Feed
                        <ArrowUpDown className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                      </Button>
                    </footer>*/}

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
