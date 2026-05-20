import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import {
  useGetAllSellersQuery,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} from "@/features/seller/sellerApi";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, RefreshCw, AlertCircle, Trash2, ShieldCheck, ShieldAlert, Award, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

export default function SellerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSeller, setEditingSeller] = useState<any>(null);
  const [viewingLicense, setViewingLicense] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllSellersQuery();
  const [updateSeller, { isLoading: isUpdating }] = useUpdateSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();

  const sellersList = response?.data?.items || [];
  const filteredSellers = sellersList.filter((s: any) =>
    s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (sellerId: string, status: string) => {
    try {
      await updateSeller({ id: sellerId, data: { status: status as any } }).unwrap();
      toast.success(`Seller status updated to ${status}`);
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to update status");
    }
  };

  const handleCommissionChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSeller) return;
    const formData = new FormData(e.currentTarget);
    const commissionPercentage = Number(formData.get("commissionPercentage"));

    try {
      await updateSeller({
        id: editingSeller._id,
        data: { commissionPercentage },
      }).unwrap();
      toast.success("Commission percentage updated");
      setEditingSeller(null);
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to update commission");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSeller(deletingId).unwrap();
      toast.success("Seller account deleted successfully");
      setDeletingId(null);
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete seller");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Approved</Badge>;
      case "suspended":
        return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Suspended</Badge>;
      case "rejected":
        return <Badge className="bg-neutral-500/10 text-neutral-500 hover:bg-neutral-500/20 border-neutral-500/20">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Pending</Badge>;
    }
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sellers Directory</h1>
            <p className="text-muted-foreground">
              Review multi-vendor shop applications, adjust platform commissions, and manage access privileges.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by shop name..."
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
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Sellers</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem loading the seller accounts. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Logo</TableHead>
                    <TableHead className="font-semibold">Shop Name</TableHead>
                    <TableHead className="font-semibold">Address</TableHead>
                    <TableHead className="font-semibold">Commission</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Docs</TableHead>
                    <TableHead className="w-[180px] text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No sellers registered.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSellers.map((seller: any) => (
                      <TableRow key={seller._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <img
                            src={seller.logo?.small || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=60&auto=format&fit=crop&q=60"}
                            alt="Logo"
                            className="h-9 w-9 rounded-full object-cover border border-muted bg-muted"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">{seller.shopName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]" title={seller.address}>
                          {seller.address}
                        </TableCell>
                        <TableCell className="font-semibold">{seller.commissionPercentage}%</TableCell>
                        <TableCell>{getStatusBadge(seller.status)}</TableCell>
                        <TableCell>
                          {seller.tradeLicense?.original ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-primary"
                              onClick={() => setViewingLicense(seller)}
                            >
                              <FileText className="h-4 w-4" /> View
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {seller.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                                  onClick={() => handleStatusChange(seller._id, "approved")}
                                  title="Approve Seller"
                                  disabled={isUpdating}
                                >
                                  <ShieldCheck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                                  onClick={() => handleStatusChange(seller._id, "rejected")}
                                  title="Reject Seller"
                                  disabled={isUpdating}
                                >
                                  <ShieldAlert className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {seller.status === "approved" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-500 hover:bg-amber-500/10"
                                onClick={() => handleStatusChange(seller._id, "suspended")}
                                title="Suspend Seller"
                                disabled={isUpdating}
                              >
                                <ShieldAlert className="h-4 w-4" />
                              </Button>
                            )}
                            {seller.status === "suspended" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                                onClick={() => handleStatusChange(seller._id, "approved")}
                                title="Re-approve Seller"
                                disabled={isUpdating}
                              >
                                <ShieldCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setEditingSeller(seller)}
                              title="Edit Commission"
                            >
                              <Award className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                              onClick={() => setDeletingId(seller._id)}
                              title="Delete Seller"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* Edit Commission Modal */}
        <Dialog open={!!editingSeller} onOpenChange={() => setEditingSeller(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit Commission Percentage</DialogTitle>
            </DialogHeader>
            {editingSeller && (
              <form onSubmit={handleCommissionChange} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="commissionPercentage">Commission (%)</Label>
                  <Input
                    id="commissionPercentage"
                    name="commissionPercentage"
                    type="number"
                    defaultValue={editingSeller.commissionPercentage}
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* View Trade License Modal */}
        <Dialog open={!!viewingLicense} onOpenChange={() => setViewingLicense(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{viewingLicense?.shopName} - Trade License</DialogTitle>
            </DialogHeader>
            {viewingLicense?.tradeLicense?.original && (
              <div className="flex justify-center p-2 border rounded-lg bg-black/5 dark:bg-white/5">
                <img
                  src={viewingLicense.tradeLicense.original}
                  alt="Trade License"
                  className="max-h-[400px] object-contain rounded"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert */}
        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the seller account from the platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayoutWithAuth>
  );
}