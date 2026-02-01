"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  MoreHorizontal,
  Search,
  User,
  Mail,
  Shield,
  ShieldCheck,
  UserCog,
  UserMinus,
  CheckCircle2,
  Clock,
  Trash2,
  Fingerprint,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const UserTable = () => {
  const users = useQuery(api.functions.query.getAllUsers);
  const updateStatus = useMutation(api.functions.mutations.updateUserStatus);
  const updateRole = useMutation(api.functions.mutations.updateUserRole);
  const deleteUser = useMutation(api.functions.mutations.deleteUser);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.clerk_user_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and account status.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users or emails..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A comprehensive list of registered users and their current status.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[60dvh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0 z-10">
                  <TableHead className="w-30 font-bold">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-4 w-4" /> Clerk ID
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Role
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users === undefined ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user) => (
                    <TableRow
                      key={user._id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {user.clerk_user_id.slice(0, 12)}...
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "outline"
                          }
                          className={`capitalize gap-1 ${user.role === "admin" ? "bg-sky-600 hover:bg-sky-700" : ""}`}
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.email}
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <Badge
                            variant="outline"
                            className="gap-1 border-emerald-500/50 text-emerald-600 bg-emerald-50"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" /> {user.status}
                          </Badge>
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
                          <DropdownMenuContent
                            align="end"
                            className="w-45"
                          >
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                try {
                                  updateRole({
                                    id: user._id,
                                    role:
                                      user.role === "admin" ? "user" : "admin",
                                  })
                                } catch (error) {
                                  toast.error((error as Error).message);
                                }
                              }
                              }
                            >
                              {user.role === "admin" ? (
                                <>
                                  <UserMinus className="h-4 w-4" /> Demote to
                                  User
                                </>
                              ) : (
                                <>
                                  <UserCog className="h-4 w-4" /> Promote to
                                  Admin
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() =>
                                updateStatus({
                                  id: user._id,
                                  status:
                                    user.status === "active"
                                      ? "pending"
                                      : "active",
                                })
                              }
                            >
                              {user.status === "active" ? (
                                <>
                                  <Clock className="h-4 w-4" /> Mark as Pending
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4" /> Confirm
                                  User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              className="gap-2 cursor-pointer"
                              onClick={() => deleteUser({ id: user._id })}
                            >
                              <Trash2 className="h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTable;
