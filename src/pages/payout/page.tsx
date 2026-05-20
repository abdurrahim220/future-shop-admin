import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import {
  useGetAllPayoutsQuery,
  useUpdatePayoutStatusMutation,
} from "@/features/payout/payoutApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, AlertCircle, Check, X, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

export default function PayoutPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllPayoutsQuery();
  const [updatePayoutStatus, { isLoading: isUpdating }] = useUpdatePayoutStatusMutation();

  const payoutsList = response?.data?.items || [];
  const filteredPayouts = payoutsList.filter((p: any) => {
    const shopName = typeof p.sellerId === "object" && p.sellerId !== null ? p.sellerId.shopName : "";
    return shopName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updatePayoutStatus({ id, status }).unwrap();
      toast.success(`Payout request marked as ${status}`);
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to update payout request");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Rejected</Badge>;
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
            <h1 className="text-3xl font-bold tracking-tight">Payout Requests</h1>
            <p className="text-muted-foreground">
              Review and clear vendor financial withdrawal requests.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by vendor shop name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Payouts</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem loading withdrawal requests. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Request ID</TableHead>
                    <TableHead className="font-semibold">Seller Shop Name</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Request Date</TableHead>
                    <TableHead className="w-[120px] text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No payout requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayouts.map((payout: any) => (
                      <TableRow key={payout._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs text-primary font-semibold">
                          #{payout._id.substring(payout._id.length - 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {typeof payout.sellerId === "object" && payout.sellerId !== null
                            ? payout.sellerId.shopName
                            : `Seller ID: ${payout.sellerId}`}
                        </TableCell>
                        <TableCell className="font-bold text-primary py-4">
                          ${payout.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payout.status)}</TableCell>
                        <TableCell className="text-xs">
                          {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          {payout.status === "pending" ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                                onClick={() => handleUpdateStatus(payout._id, "approved")}
                                title="Approve Withdrawal"
                                disabled={isUpdating}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                                onClick={() => handleUpdateStatus(payout._id, "rejected")}
                                title="Reject Withdrawal"
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic flex items-center justify-end gap-1">
                              Cleared <ArrowUpRight className="h-3 w-3" />
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWithAuth>
  );
}