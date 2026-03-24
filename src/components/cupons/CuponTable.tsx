import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import type { ICupon } from "@/types/cuponTypes";
import { format } from "date-fns";

interface CuponTableProps {
  data: ICupon[];
  onEdit: (cupon: ICupon) => void;
  onDelete: (id: string) => void;
}

export function CuponTable({ data, onEdit, onDelete }: CuponTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Validity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No coupons found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((cupon) => (
              <TableRow key={cupon._id}>
                <TableCell className="font-bold">{cupon.code}</TableCell>
                <TableCell>
                  {cupon.discountValue}
                  {cupon.discountType === "percentage" ? "%" : " BDT"}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {cupon.usedCount} / {cupon.usageLimit}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(cupon.validFrom), "MMM d")} -{" "}
                  {format(new Date(cupon.validTo), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={cupon.status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {cupon.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(cupon)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(cupon._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
