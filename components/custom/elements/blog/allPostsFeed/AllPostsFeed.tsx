"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Clock, ArrowUpDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const AllPostsFeed = () => {
  const posts = useQuery(api.functions.query.GetAllPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    let result = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
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
          {filteredAndSortedPosts.filter((i) => !i.hidden && i.status.toLowerCase() === "public").map((post) => (
            <Dialog key={post._id}>
              <DialogTrigger asChild>
                <Card className="flex flex-col hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <Badge variant={post.hidden ? "secondary" : "default"}>
                        {post.hidden ? "Private" : "Public"}
                      </Badge>
                      <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.description}
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(post._creationTime).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <BookOpen className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-5xl scroll-smooth max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{post.status}</Badge>
                    <Badge variant="outline">
                      {new Date(post._creationTime).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Badge>
                  </div>
                  <DialogTitle className="text-3xl font-bold leading-tight">
                    {post.title}
                  </DialogTitle>
                  <DialogDescription className="text-lg text-muted-foreground italic">
                    {post.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
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
