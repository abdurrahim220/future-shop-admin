import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCuponMutation,
  useUpdateCuponMutation,
} from "@/features/cupons/cuponApi";
import { Loader2 } from "lucide-react";
import type { ICupon } from "@/types/cuponTypes";
import { toast } from "react-toastify";

interface CuponFormProps {
  initialData?: ICupon | null;
  onSuccess: () => void;
}

export default function CuponForm({
  initialData,
  onSuccess,
}: CuponFormProps) {
  const [createCupon, { isLoading: isCreating }] = useCreateCuponMutation();
  const [updateCupon, { isLoading: isUpdating }] = useUpdateCuponMutation();

  const form = useForm({
    defaultValues: {
      code: initialData?.code || "",
      discountType: initialData?.discountType || "percentage",
      discountValue: initialData?.discountValue || 0,
      maxDiscount: initialData?.maxDiscount || 0,
      minPurchaseAmount: initialData?.minPurchaseAmount || 0,
      usageLimit: initialData?.usageLimit || 1,
      validFrom: initialData?.validFrom
        ? new Date(initialData.validFrom).toISOString().split("T")[0]
        : "",
      validTo: initialData?.validTo
        ? new Date(initialData.validTo).toISOString().split("T")[0]
        : "",
      status: initialData?.status || "active",
    },
  });

  const onSubmit = async (values: Partial<ICupon>) => {
    try {
      if (initialData) {
        await updateCupon({ id: initialData._id, data: values }).unwrap();
        toast.success("Coupon updated successfully");
      } else {
        await createCupon(values).unwrap();
        toast.success("Coupon created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to save coupon");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input placeholder="SAVE50" className="uppercase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minPurchaseAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Purchase (BDT)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid To</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isCreating || isUpdating}
        >
          {(isCreating || isUpdating) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {initialData ? "Update Coupon" : "Create Coupon"}
        </Button>
      </form>
    </Form>
  );
}
