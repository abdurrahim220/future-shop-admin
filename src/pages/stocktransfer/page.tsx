import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import {
  useGetAllStockTransfersQuery,
  useCreateStockTransferMutation,
  useUpdateStockTransferMutation,
} from "@/features/stocktransfer/stockTransferApi";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, Plus, Check, X, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface NewTransferForm {
  fromBranchId: string;
  toBranchId: string;
  productId: string;
  variantId: string;
  quantity: number;
}

export default function StockTransferPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const queryParams: Record<string, string> = {
    page: currentPage.toString(),
  };
  if (searchTerm) queryParams.search = searchTerm;

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllStockTransfersQuery(queryParams);

  const [createTransfer, { isLoading: isCreating }] = useCreateStockTransferMutation();
  const [updateTransfer, { isLoading: isUpdating }] = useUpdateStockTransferMutation();

  const { register, handleSubmit, reset } = useForm<NewTransferForm>();

  const transfersList = response?.data || [];

  const handleCreate = async (data: NewTransferForm) => {
    try {
      await createTransfer({
        fromBranchId: data.fromBranchId,
        toBranchId: data.toBranchId,
        items: [
          {
            productId: data.productId,
            variantId: data.variantId,
            quantity: Number(data.quantity),
          },
        ],
      }).unwrap();
      toast.success("Stock transfer requested successfully");
      setIsFormOpen(false);
      reset();
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to create transfer");
    }
  };

  const handleUpdateStatus = async (id: string, status: "completed" | "cancelled") => {
    try {
      await updateTransfer({ id, data: { status } }).unwrap();
      toast.success(`Transfer marked as ${status}`);
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to update transfer status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Cancelled</Badge>;
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
            <h1 className="text-3xl font-bold tracking-tight">Stock Transfers</h1>
            <p className="text-muted-foreground">
              Monitor and dispatch shipments shifting stock between warehouse locations.
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Request Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>New Stock Transfer Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleCreate)} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromBranchId">Source Branch ID</Label>
                    <Input id="fromBranchId" {...register("fromBranchId", { required: true })} placeholder="Source ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toBranchId">Dest Branch ID</Label>
                    <Input id="toBranchId" {...register("toBranchId", { required: true })} placeholder="Destination ID" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID</Label>
                  <Input id="productId" {...register("productId", { required: true })} placeholder="Mongoose Product ID" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="variantId">Variant ID</Label>
                    <Input id="variantId" {...register("variantId", { required: true })} placeholder="Variant ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" {...register("quantity", { required: true, min: 1 })} placeholder="Qty" />
                  </div>
                </div>

                <Button type="submit" disabled={isCreating} className="w-full pt-2">
                  {isCreating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Initiate Transfer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by branch or status..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
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
            <h3 className="text-lg font-semibold">Error Loading Transfers</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem loading warehouse transfers. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Transfer ID</TableHead>
                    <TableHead className="font-semibold">Route</TableHead>
                    <TableHead className="font-semibold">Items Count</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="w-[100px] text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfersList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No stock transfers recorded.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transfersList.map((transfer) => (
                      <TableRow key={transfer._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs text-primary font-semibold">
                          #{transfer._id.substring(transfer._id.length - 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{transfer.fromBranchId}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono">{transfer.toBranchId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{transfer.items?.length || 0} product(s)</TableCell>
                        <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                        <TableCell className="text-xs">
                          {transfer.createdAt ? new Date(transfer.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          {transfer.status.toLowerCase() === "pending" ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                                onClick={() => handleUpdateStatus(transfer._id, "completed")}
                                disabled={isUpdating}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                                onClick={() => handleUpdateStatus(transfer._id, "cancelled")}
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{transfersList.length}</span> transfers.
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isFetching}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={transfersList.length < 10 || isFetching}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWithAuth>
  );
}