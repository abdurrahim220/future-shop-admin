import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import {
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useChangeRoleMutation,
} from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, AlertCircle, ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

export default function UserPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoleUser, setEditingRoleUser] = useState<any>(null);

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllUsersQuery();
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const [changeRole, { isLoading: isChangingRole }] = useChangeRoleMutation();

  const usersList = response?.data || [];
  const filteredUsers = usersList.filter((u: any) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockToggle = async (user: any) => {
    try {
      if (user.status === "blocked") {
        await unblockUser(user._id).unwrap();
        toast.success(`${user.name} has been unblocked`);
      } else {
        await blockUser(user._id).unwrap();
        toast.success(`${user.name} has been blocked`);
      }
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Action failed");
    }
  };

  const handleRoleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRoleUser) return;
    const formData = new FormData(e.currentTarget);
    const role = formData.get("role") as string;

    try {
      await changeRole({ userId: editingRoleUser._id, role }).unwrap();
      toast.success("User role updated successfully");
      setEditingRoleUser(null);
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to update role");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "blocked") {
      return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Blocked</Badge>;
    }
    return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Active</Badge>;
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Admin</Badge>;
      case "seller":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Seller</Badge>;
      default:
        return <Badge className="bg-neutral-500/10 text-neutral-500 hover:bg-neutral-500/20 border-neutral-500/20">Customer</Badge>;
    }
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users Directory</h1>
            <p className="text-muted-foreground">
              Manage system access permissions, block suspicious users, and edit access roles.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Content Table */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Users</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem fetching user profiles. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">User ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="w-[120px] text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No users registered.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user: any) => (
                      <TableRow key={user._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs text-primary font-semibold">
                          #{user._id.substring(user._id.length - 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-semibold">{user.name}</TableCell>
                        <TableCell className="text-xs">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${user.status === "blocked" ? "text-emerald-500 hover:bg-emerald-500/10" : "text-rose-500 hover:bg-rose-500/10"}`}
                              onClick={() => handleBlockToggle(user)}
                              title={user.status === "blocked" ? "Unblock Account" : "Block Account"}
                              disabled={isBlocking || isUnblocking}
                            >
                              {user.status === "blocked" ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setEditingRoleUser(user)}
                              title="Update Role"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Change Role Modal */}
        <Dialog open={!!editingRoleUser} onOpenChange={() => setEditingRoleUser(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Update Access Role</DialogTitle>
            </DialogHeader>
            {editingRoleUser && (
              <form onSubmit={handleRoleChange} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue={editingRoleUser.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isChangingRole}>
                  {isChangingRole ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Role Changes
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayoutWithAuth>
  );
}