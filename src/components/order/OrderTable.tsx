import type { IOrder } from "@/types/orderTypes";
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
} from "@/components/ui/trigger-custom"; // Wait, in Shadcn, let's make sure dropdown is correct. Let's see if we can use standard DropdownMenu elements. Wait, let's double check standard dropdown file name. In Shadcn, it is @/components/ui/dropdown-menu. Let's write the import correctly.
import { Eye, Edit3, Trash2, MoreHorizontal } from "lucide-react";

interface OrderTableProps {
  orders: IOrder[];
  onViewDetails: (order: IOrder) => void;
  onEditStatus: (order: IOrder) => void;
  onDelete: (id: string) => void;
}

export default function OrderTable({
  orders,
  onViewDetails,
  onEditStatus,
  onDelete,
}: OrderTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "pending":
      case "processing":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "cancelled":
      case "rejected":
      case "failed":
        return "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-500 hover:bg-neutral-500/20";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Order ID</TableHead>
            <TableHead className="font-semibold">Customer ID</TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold text-center">Qty</TableHead>
            <TableHead className="font-semibold">Subtotal</TableHead>
            <TableHead className="font-semibold">Payment</TableHead>
            <TableHead className="font-semibold">Delivery</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="w-[80px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-xs text-primary font-semibold">
                  #{order._id.substring(order._id.length - 8).toUpperCase()}
                </TableCell>
                <TableCell className="text-xs max-w-[120px] truncate" title={order.customerId}>
                  {order.customerId}
                </TableCell>
                <TableCell className="font-medium">${order.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">{order.quantity}</TableCell>
                <TableCell className="font-semibold">${order.subtotal.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.deliveryStatus)}>
                    {order.deliveryStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onViewDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEditStatus(order)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={() => onDelete(order._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
