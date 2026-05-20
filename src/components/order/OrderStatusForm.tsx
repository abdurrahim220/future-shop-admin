import { useForm } from "react-hook-form";
import type { IOrder, UpdateOrderPayload } from "@/types/orderTypes";
import { useUpdateOrderMutation } from "@/features/order/orderApi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { RefreshCw } from "lucide-react";

interface OrderStatusFormProps {
  order: IOrder;
  onSuccess: () => void;
}

export default function OrderStatusForm({ order, onSuccess }: OrderStatusFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<UpdateOrderPayload>({
    defaultValues: {
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
    },
  });

  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const onSubmit = async (data: UpdateOrderPayload) => {
    try {
      await updateOrder({ id: order._id, data }).unwrap();
      toast.success("Order status updated successfully");
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to update order status");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="status">Order Status</Label>
        <Select
          defaultValue={order.status}
          onValueChange={(val) => setValue("status", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select
          defaultValue={order.paymentStatus}
          onValueChange={(val) => setValue("paymentStatus", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryStatus">Delivery Status</Label>
        <Select
          defaultValue={order.deliveryStatus}
          onValueChange={(val) => setValue("deliveryStatus", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select delivery status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
