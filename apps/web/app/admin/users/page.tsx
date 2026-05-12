"use client";

import { MoreHorizontal, UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEMO_ADMIN_USERS } from "@/lib/admin-mock-data";

const statusVariant = {
  active: "success" as const,
  invited: "secondary" as const,
  suspended: "destructive" as const,
};

export default function AdminUsersPage() {
  return (
    <>
      <AdminPageHeader
        title="User management"
        description="Directory, lifecycle, and access reviews. Wire to your identity provider and /users admin endpoints when available."
        actions={
          <>
            <Button variant="outline" className="border-border/80">
              Import CSV
            </Button>
            <Button>
              <UserPlus className="h-4 w-4" />
              Invite user
            </Button>
          </>
        }
      />

      <div className="rounded-xl border border-border/80 bg-card/40 p-4 backdrop-blur-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{DEMO_ADMIN_USERS.length}</strong> demo rows — replace with live query.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="w-[52px] text-right"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_ADMIN_USERS.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell className="capitalize">{u.role}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[u.status]}>{u.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.lastActive}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Reset MFA</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        Suspend user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
