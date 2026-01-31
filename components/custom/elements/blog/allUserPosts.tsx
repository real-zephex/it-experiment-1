"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

const AllPostsUser = () => {
  const { user } = useUser();
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

  const debounceTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const debouncedTogglePostVis = useCallback(
    (id: Id<"blogs">, hidden: boolean) => {
      if (debounceTimersRef.current[`toggle-${id}`]) {
        clearTimeout(debounceTimersRef.current[`toggle-${id}`]);
      }
      debounceTimersRef.current[`toggle-${id}`] = setTimeout(() => {
        togglePostVis({ id, hidden });
      }, 300);
    },
    [togglePostVis],
  );

  const debouncedDeletePost = useCallback(
    (id: Id<"blogs">) => {
      if (debounceTimersRef.current[`delete-${id}`]) {
        clearTimeout(debounceTimersRef.current[`delete-${id}`]);
      }
      debounceTimersRef.current[`delete-${id}`] = setTimeout(() => {
        deletePost({ id });
      }, 300);
    },
    [deletePost],
  );

  if (postRecords === undefined) {
    return (
      <div className="p-10">
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (postRecords?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed rounded-xl bg-muted/30">
        <div className="bg-muted p-4 rounded-full">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">No posts yet</h3>
          <p className="text-sm text-muted-foreground max-w-62.5">
            You haven&apos;t created any blog posts yet. Start sharing your
            thoughts with the world!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <Carousel>
        <CarouselContent>
          {postRecords?.map((posts, index) => (
            <CarouselItem key={index}>
              <div className="h-full">
                <Card className="h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold line-clamp-2">
                        {posts.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {posts.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {posts.status}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                        {posts.hidden ? "Hidden" : "Public"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {/* <div>
                        <p className="font-semibold">Author</p>
                        <p>{posts.author}</p>
                      </div> */}
                      <div>
                        <p className="font-semibold">Date</p>
                        <p>{new Date(posts._creationTime).toLocaleString()}</p>
                      </div>
                    </div>

                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button>View Post</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{posts.title}</DrawerTitle>
                          <DrawerDescription>
                            {posts.description}
                          </DrawerDescription>
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                            <Badge>{posts.status}</Badge>
                            <Badge
                              variant={posts.hidden ? "destructive" : "default"}
                            >
                              {posts.hidden ? "Hidden" : "Public"}
                            </Badge>
                          </div>
                          <div className="max-w-4xl mx-auto px-4 py-6">
                            <p className="text-left text-sm leading-relaxed text-foreground whitespace-pre-wrap line-clamp-10">
                              {posts.content}
                            </p>
                          </div>
                        </DrawerHeader>
                        <DrawerFooter>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant="outline"
                              onClick={() =>
                                debouncedTogglePostVis(posts._id, !posts.hidden)
                              }
                            >
                              {posts.hidden ? "Make Public" : "Make Private"}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => debouncedDeletePost(posts._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="text-sm text-center my-2 text-muted-foreground">
        All your posts are displayed above.
      </p>
    </div>
  );
};

export default AllPostsUser;
