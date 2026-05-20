import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllAddressesQuery } from "@/features/address/userAddressApi";
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
import { Search, RefreshCw, AlertCircle, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllAddressesQuery();

  const addressesList = response?.data?.items || [];
  const filteredAddresses = addressesList.filter((addr: any) => {
    const division = addr.division || "";
    const district = addr.district || "";
    const upazilla = addr.upazilla || "";
    const village = addr.village || "";
    return (
      division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upazilla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Addresses Lookup</h1>
            <p className="text-muted-foreground">
              Browse billing, shipping, and home locations cataloged per user account.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by city, division, or district..."
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
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Addresses</h3>
            <p className="text-muted-foreground mb-4">
              Failed to load registered address catalogs. Please try again.
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
                    <TableHead className="font-semibold">Village / Street</TableHead>
                    <TableHead className="font-semibold">Upazilla / District</TableHead>
                    <TableHead className="font-semibold">Division</TableHead>
                    <TableHead className="font-semibold">Contact Info</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAddresses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No addresses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAddresses.map((addr: any) => (
                      <TableRow key={addr._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs">
                          {typeof addr.userId === "object" && addr.userId !== null
                            ? addr.userId.name
                            : addr.userId}
                        </TableCell>
                        <TableCell className="font-semibold">{addr.village}</TableCell>
                        <TableCell className="text-xs">
                          {addr.upazilla}, {addr.district}
                        </TableCell>
                        <TableCell className="text-xs font-semibold">{addr.division}</TableCell>
                        <TableCell className="text-xs">
                          <div>{addr.email}</div>
                          <div className="text-muted-foreground">{addr.phone}</div>
                        </TableCell>
                        <TableCell>
                          {addr.isDefault ? (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 flex w-fit">
                              <MapPin className="h-3 w-3" /> Default
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground w-fit">
                              Secondary
                            </Badge>
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
