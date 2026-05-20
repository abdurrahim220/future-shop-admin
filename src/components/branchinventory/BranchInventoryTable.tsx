import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { IBranchInventory } from "@/types/branchInventoryTypes";
import { AlertTriangle, CheckCircle, Package2, Building2 } from "lucide-react";

interface BranchInventoryTableProps {
  inventories: IBranchInventory[];
}

export default function BranchInventoryTable({ inventories }: BranchInventoryTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="hidden md:table-cell">Variant</TableHead>
            <TableHead className="text-right">Stock Level</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Reorder Point</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No inventory records found.
              </TableCell>
            </TableRow>
          ) : (
            inventories.map((inv) => {
              const branchName = typeof inv.branchId === "object" && inv.branchId ? inv.branchId.branchName : "Unknown Branch";
              const productName = typeof inv.productId === "object" && inv.productId ? inv.productId.name : "Unknown Product";
              const isLowStock = inv.stock <= inv.reorderLevel && inv.stock > 0;
              const isOutOfStock = inv.stock === 0;

              return (
                <TableRow key={inv._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{branchName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium line-clamp-1">{productName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground font-mono text-xs">
                    {inv.variantId || "Default"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <span className={isOutOfStock ? "text-destructive font-bold" : isLowStock ? "text-warning" : "text-foreground"}>
                      {inv.stock}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                    {inv.reorderLevel}
                  </TableCell>
                  <TableCell className="text-center">
                    {isOutOfStock ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Out of Stock
                      </Badge>
                    ) : isLowStock ? (
                      <Badge variant="warning" className="gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="default" className="gap-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                        <CheckCircle className="h-3 w-3" />
                        Healthy
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
