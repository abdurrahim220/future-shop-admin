import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IBranch } from "@/types/branchTypes";
import { toast } from "react-toastify";
import { useCreateBranchMutation, useUpdateBranchMutation } from "@/features/branches/branchApi";
import { useGetAllSellersQuery } from "@/features/seller/sellerApi";
import { Loader2 } from "lucide-react";

interface BranchFormProps {
  initialData?: IBranch | null;
  onSuccess: () => void;
}

interface FormValues {
  sellerId: string;
  branchName: string;
  branchCode: string;
  type: "store" | "warehouse";
  phone: string;
  address: string;
  city: string;
  state: string;
  status: "active" | "inactive";
}

export default function BranchForm({ initialData, onSuccess }: BranchFormProps) {
  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const { data: sellersResponse } = useGetAllSellersQuery();
  const sellers = sellersResponse?.data
    ? (Array.isArray(sellersResponse.data) ? sellersResponse.data : (sellersResponse.data as any).items || [])
    : [];

  const form = useForm<FormValues>({
    defaultValues: {
      sellerId: typeof initialData?.sellerId === "object" && initialData.sellerId
        ? initialData.sellerId._id
        : (initialData?.sellerId as string) || "",
      branchName: initialData?.branchName || "",
      branchCode: initialData?.branchCode || "",
      type: initialData?.type || "store",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      status: initialData?.status || "active",
    },
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (values: FormValues) => {
    try {
      if (initialData) {
        await updateBranch({ id: initialData._id, data: values }).unwrap();
        toast.success("Branch updated successfully");
      } else {
        await createBranch(values).unwrap();
        toast.success("Branch created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ path: string; message: string }>;
        };
      };
      if (apiError.data?.errorMessages && apiError.data.errorMessages.length > 0) {
        const errors = apiError.data.errorMessages
          .map((e) => `${e.path}: ${e.message}`)
          .join(" | ");
        toast.error(`Validation Error: ${errors}`);
      } else {
        toast.error(apiError.data?.message || "Something went wrong saving branch");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
        <FormField
          control={form.control}
          name="sellerId"
          rules={{ required: "Seller / Shop is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seller / Shop</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select seller / shop" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sellers.map((seller: any) => (
                    <SelectItem key={seller._id} value={seller._id}>
                      {seller.shopName}
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
          name="branchName"
          rules={{
            required: "Branch name is required",
            minLength: { value: 2, message: "Branch name must be at least 2 characters" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Central Warehouse" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="branchCode"
            rules={{
              required: "Branch code is required",
              minLength: { value: 2, message: "Branch code must be at least 2 characters" }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Code</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., BR-001" {...field} disabled={!!initialData} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            rules={{ required: "Branch type is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          rules={{
            required: "Contact phone is required",
            minLength: { value: 10, message: "Phone number must be at least 10 characters" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input placeholder="E.g., +1555019900" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          rules={{
            required: "Address is required",
            minLength: { value: 5, message: "Address must be at least 5 characters" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Street name and number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            rules={{
              required: "City is required",
              minLength: { value: 2, message: "City must be at least 2 characters" }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            rules={{
              required: "State is required",
              minLength: { value: 2, message: "State must be at least 2 characters" }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Branch" : "Create Branch"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
