import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllSubOrdersQuery } from "@/features/suborder/suborderApi";
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
import { Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubOrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: subOrdersResponse, isLoading, isError, refetch, isFetching } = useGetAllSubOrdersQuery({
    search: searchTerm || undefined,
    page: currentPage.toString(),
  });

  const subOrdersList = subOrdersResponse?.data?.items || [];

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sub-Orders</h1>
            <p className="text-muted-foreground">
              Monitor orders partitioned dynamically per vendor seller profile.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or seller..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
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
            <h3 className="text-lg font-semibold">Error Loading Sub-Orders</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem loading vendor suborders. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Sub-Order ID</TableHead>
                    <TableHead className="font-semibold">Parent Order ID</TableHead>
                    <TableHead className="font-semibold">Product ID</TableHead>
                    <TableHead className="font-semibold">Seller ID</TableHead>
                    <TableHead className="font-semibold">Branch ID</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subOrdersList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No sub-orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subOrdersList.map((subOrder) => (
                      <TableRow key={subOrder._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs text-primary font-semibold">
                          #{subOrder._id.substring(subOrder._id.length - 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {typeof subOrder.orderId === "object" && subOrder.orderId !== null
                            ? subOrder.orderId._id
                            : subOrder.orderId}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {typeof subOrder.productId === "object" && subOrder.productId !== null
                            ? subOrder.productId.name
                            : subOrder.productId}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {typeof subOrder.sellerId === "object" && subOrder.sellerId !== null
                            ? subOrder.sellerId.shopName
                            : subOrder.sellerId}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {typeof subOrder.branchId === "object" && subOrder.branchId !== null
                            ? subOrder.branchId.branchName
                            : subOrder.branchId}
                        </TableCell>
                        <TableCell className="text-xs">
                          {subOrder.createdAt ? new Date(subOrder.createdAt).toLocaleDateString() : "N/A"}
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
                Showing <span className="font-medium">{subOrdersList.length}</span> sub-orders.
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
                  disabled={subOrdersList.length < 10 || isFetching}
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