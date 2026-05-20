import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IProduct } from "@/types/productTypes";
import { Edit2, Trash2, MoreHorizontal, Layers, Tag, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductTableProps {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
  onViewVariants: (product: IProduct) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onViewVariants,
}: ProductTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" />
                    {product.categoryId || "None"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    {product.brandId || "None"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.hasVariants ? "outline" : "secondary"}>
                    {product.hasVariants ? "Multi-Variant" : "Standard"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(product.status)}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {product.hasVariants && (
                        <DropdownMenuItem onClick={() => onViewVariants(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Variants
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
