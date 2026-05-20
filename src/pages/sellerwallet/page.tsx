import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllSellerWalletsQuery } from "@/features/sellerwallet/sellerWalletApi";
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
import { Search, RefreshCw, AlertCircle, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerWalletPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllSellerWalletsQuery();

  const walletsList = response?.data?.items || [];
  const filteredWallets = walletsList.filter((w: any) => {
    const shopName = typeof w.sellerId === "object" && w.sellerId !== null ? w.sellerId.shopName : "";
    return shopName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seller Wallets</h1>
            <p className="text-muted-foreground">
              Verify real-time multi-vendor ledger account balances and pending transactions.
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
            <h3 className="text-lg font-semibold">Error Loading Wallets</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem loading vendor wallets. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Wallet ID</TableHead>
                    <TableHead className="font-semibold">Seller Shop Name</TableHead>
                    <TableHead className="font-semibold">Balance</TableHead>
                    <TableHead className="font-semibold">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No vendor wallets found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWallets.map((wallet: any) => (
                      <TableRow key={wallet._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs text-primary font-semibold">
                          #{wallet._id.substring(wallet._id.length - 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {typeof wallet.sellerId === "object" && wallet.sellerId !== null
                            ? wallet.sellerId.shopName
                            : `Seller ID: ${wallet.sellerId}`}
                        </TableCell>
                        <TableCell className="font-bold text-emerald-500 flex items-center gap-1.5 py-4">
                          <Wallet className="h-4 w-4" />
                          ${wallet.balance.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleString() : "N/A"}
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