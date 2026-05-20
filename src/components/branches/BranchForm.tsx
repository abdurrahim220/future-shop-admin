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
import { Loader2 } from "lucide-react";

interface BranchFormProps {
  initialData?: IBranch | null;
  onSuccess: () => void;
}

interface FormValues {
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

  const form = useForm<FormValues>({
    defaultValues: {
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
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Something went wrong saving branch");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
        <FormField
          control={form.control}
          name="branchName"
          rules={{ required: "Branch name is required" }}
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
            rules={{ required: "Branch code is required" }}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          rules={{ required: "Contact phone is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input placeholder="E.g., +15550199" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          rules={{ required: "Address is required" }}
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
            rules={{ required: "City is required" }}
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
            rules={{ required: "State is required" }}
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
