import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
} from "@/features/order/orderApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import OrderTable from "@/components/order/OrderTable";
import OrderStatusForm from "@/components/order/OrderStatusForm";
import type { IOrder } from "@/types/orderTypes";
import { Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function OrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<IOrder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryParams: Record<string, string> = {
    page: currentPage.toString(),
  };
  if (searchTerm) queryParams.search = searchTerm;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data: ordersResponse, isLoading, isError, refetch, isFetching } = useGetAllOrdersQuery(queryParams);

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleEdit = (order: IOrder) => {
    setEditingOrder(order);
  };

  const handleViewDetails = (order: IOrder) => {
    setViewingOrder(order);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteOrder(deletingId).unwrap();
      toast.success("Order deleted successfully");
      setDeletingId(null);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete order");
    }
  };

  const ordersList = ordersResponse?.data || [];

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Manage transactions, order processing states, and payment/delivery verification.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer/order ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Orders</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem fetching the orders database. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <OrderTable
              orders={ordersList}
              onViewDetails={handleViewDetails}
              onEditStatus={handleEdit}
              onDelete={(id) => setDeletingId(id)}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{ordersList.length}</span> orders.
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
                  disabled={ordersList.length < 10 || isFetching}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
            </DialogHeader>
            {viewingOrder && (
              <div className="space-y-4 py-2 text-sm">
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Order ID</span>
                    <span className="font-mono font-semibold text-primary">{viewingOrder._id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Customer ID</span>
                    <span className="font-mono text-xs break-all">{viewingOrder.customerId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Product ID</span>
                    <span className="font-mono text-xs break-all">{viewingOrder.productId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Variant ID</span>
                    <span className="font-mono text-xs break-all">{viewingOrder.variantId || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Seller ID</span>
                    <span className="font-mono text-xs break-all">{viewingOrder.sellerId || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Branch ID</span>
                    <span className="font-mono text-xs break-all">{viewingOrder.branchId || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-muted/30 p-3 rounded-lg border">
                  <div className="text-center">
                    <span className="text-muted-foreground text-xs block">Unit Price</span>
                    <span className="font-semibold">${viewingOrder.price.toFixed(2)}</span>
                  </div>
                  <div className="text-center border-x">
                    <span className="text-muted-foreground text-xs block">Quantity</span>
                    <span className="font-semibold">{viewingOrder.quantity}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-muted-foreground text-xs block">Subtotal</span>
                    <span className="font-bold text-primary">${viewingOrder.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase">Statuses</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Order: {viewingOrder.status.toUpperCase()}</Badge>
                    <Badge variant="secondary">Payment: {viewingOrder.paymentStatus.toUpperCase()}</Badge>
                    <Badge variant="secondary">Delivery: {viewingOrder.deliveryStatus.toUpperCase()}</Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Status Modal */}
        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Update Order Statuses</DialogTitle>
            </DialogHeader>
            {editingOrder && (
              <OrderStatusForm
                order={editingOrder}
                onSuccess={() => {
                  setEditingOrder(null);
                  refetch();
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert */}
        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the order from the system database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayoutWithAuth>
  );
}