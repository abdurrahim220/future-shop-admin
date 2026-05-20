import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllStockMovementsQuery } from "@/features/stockmovement/stockMovementApi";
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
import { Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StockMovementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllStockMovementsQuery({
    search: searchTerm || undefined,
    type: typeFilter === "all" ? undefined : typeFilter,
    page: currentPage.toString(),
  });

  const movementsList = response?.data || [];

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "in":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 gap-1">
            <TrendingUp className="h-3 w-3" /> Stock In
          </Badge>
        );
      case "out":
        return (
          <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20 gap-1">
            <TrendingDown className="h-3 w-3" /> Stock Out
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
            Adjustment
          </Badge>
        );
    }
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock Movement Logs</h1>
            <p className="text-muted-foreground">
              Review and audit all product stock additions, sales deductions, and inventory adjustments.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by product, variant or ref ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Movement Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Movements</SelectItem>
                <SelectItem value="in">Stock In</SelectItem>
                <SelectItem value="out">Stock Out</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
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
            <h3 className="text-lg font-semibold">Error Loading Stock Logs</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem loading the stock ledger. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Log ID</TableHead>
                    <TableHead className="font-semibold">Product ID</TableHead>
                    <TableHead className="font-semibold">Branch ID</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Qty</TableHead>
                    <TableHead className="font-semibold">Reference ID</TableHead>
                    <TableHead className="font-semibold">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movementsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No stock movements logged.
                      </TableCell>
                    </TableRow>
                  ) : (
                    movementsList.map((movement) => (
                      <TableRow key={movement._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs text-primary font-semibold">
                          #{movement._id.substring(movement._id.length - 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[120px]" title={movement.productId}>
                          {movement.productId}
                        </TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[120px]" title={movement.branchId}>
                          {movement.branchId}
                        </TableCell>
                        <TableCell>{getTypeBadge(movement.type)}</TableCell>
                        <TableCell className="font-semibold">
                          {movement.type.toLowerCase() === "out" ? "-" : "+"}
                          {movement.quantity}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {movement.referenceId || "Direct Adjustment"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : "N/A"}
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
                Showing <span className="font-medium">{movementsList.length}</span> entries.
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
                  disabled={movementsList.length < 10 || isFetching}
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