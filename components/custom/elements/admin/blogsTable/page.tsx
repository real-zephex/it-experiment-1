"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  Calendar,
  Eye,
  EyeOff,
  FileText,
  Hash,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Search,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

const ManageBlogs = () => {
  const blogs = useQuery(api.functions.query.GetAllPostsWithUsers);
  const deleteBlog = useMutation(api.functions.mutations.deletePost);
  const updateBlogStatus = useMutation(
    api.functions.mutations.updatePostStatus,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs?.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blogs Management
          </h1>
          <p className="text-muted-foreground">
            Manage your blog posts, their visibility, and status.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search blogs or authors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            A list of all blog posts in the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-25 font-bold">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" /> ID
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Title
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Author
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Visibility</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Created
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs === undefined ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredBlogs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs?.map((blog) => (
                  <TableRow
                    key={blog._id}
                    className="group transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {blog._id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium max-w-62.5 truncate">
                      {blog.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {blog.user ? blog.user.name : "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {blog.hidden ? (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1 border-emerald-500/50 text-emerald-600 bg-emerald-50"
                        >
                          <Eye className="h-3 w-3" /> Visible
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          blog.status === "public" ? "default" : "destructive"
                        }
                        className={
                          blog.status === "public"
                            ? "bg-teal-600 hover:bg-teal-700"
                            : ""
                        }
                      >
                        {blog.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(blog._creationTime).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() =>
                              updateBlogStatus({
                                id: blog._id,
                                status:
                                  blog.status === "public"
                                    ? "halted"
                                    : "public",
                              })
                            }
                          >
                            {blog.status === "public" ? (
                              <>
                                <PauseCircle className="h-4 w-4" /> Halt Blog
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-4 w-4" /> Make Public
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className="gap-2 cursor-pointer"
                            onClick={() => deleteBlog({ id: blog._id })}
                          >
                            <Trash2 className="h-4 w-4" /> Delete Blog
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableCaption>List of all the blogs</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBlogs;
