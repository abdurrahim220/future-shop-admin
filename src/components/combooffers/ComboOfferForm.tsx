import { useForm, useFieldArray } from "react-hook-form";
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
  useCreateComboOfferMutation,
  useUpdateComboOfferMutation,
} from "@/features/combooffers/comboOfferApi";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { IComboOffer } from "@/types/comboOfferTypes";
import { toast } from "react-toastify";
import { useGetAllProductsQuery } from "@/features/product/productApi";

interface ComboOfferFormProps {
  initialData?: IComboOffer | null;
  onSuccess: () => void;
}

export default function ComboOfferForm({
  initialData,
  onSuccess,
}: ComboOfferFormProps) {
  const [createOffer, { isLoading: isCreating }] = useCreateComboOfferMutation();
  const [updateOffer, { isLoading: isUpdating }] = useUpdateComboOfferMutation();
  const { data: productsData } = useGetAllProductsQuery({ limit: "100" });
  const products = productsData?.data || [];

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      discountType: initialData?.discountType || "percentage",
      discountValue: initialData?.discountValue || 0,
      status: initialData?.status || "active",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      products: initialData?.products || [{ productId: "", quantityRequired: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products" as const,
  });

  const onSubmit = async (values: Partial<IComboOffer>) => {
    try {
      if (initialData) {
        await updateOffer({ id: initialData._id, data: values }).unwrap();
        toast.success("Combo offer updated successfully");
      } else {
        await createOffer(values).unwrap();
        toast.success("Combo offer created successfully");
      }
      onSuccess();
    } catch (apiError: unknown) {
      const error = apiError as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to save combo offer");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Buy 1 Get 1 Free" {...field} />
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Products</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ productId: "", quantityRequired: 1 })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name={`products.${index}.productId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((p: { _id: string; name: string }) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`products.${index}.quantityRequired`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-10 w-10"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
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
          {initialData ? "Update Combo Offer" : "Create Combo Offer"}
        </Button>
      </form>
    </Form>
  );
}
