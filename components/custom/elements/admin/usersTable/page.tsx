"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const UserTable = () => {

  const users = useQuery(api.functions.query.getAllUsers);
  const updateStatus = useMutation(api.functions.mutations.updateUserStatus);
  const updateRole = useMutation(api.functions.mutations.updateUserRole);
  const deleteUser = useMutation(api.functions.mutations.deleteUser);


  return (
    <div className="flex flex-col gap-4 border p-4 rounded-xl max-h-[80dvh] overflow-y-auto">
      <h2 className="border-l-4 border-l-sky-400 pl-2">User Management</h2>
      <Table>
        <TableCaption>A list of all the users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25 font-bold">ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>

          {users?.map((i, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{i.clerk_user_id}</TableCell>
              <TableCell className="capitalize"><Badge variant={'outline'}>{i.role}</Badge></TableCell>
              <TableCell>{i.email}</TableCell>
              <TableCell>{i.status}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => updateRole({ id: i._id, role: i.role === 'admin' ? 'user' : 'admin' })}
                    >
                      {i.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateStatus({ id: i._id, status: i.status === 'active' ? 'pending' : 'active' })}
                    >
                      {i.status === 'active' ? 'Mark as Pending' : 'Confirm User'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => deleteUser({ id: i._id })}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserTable;