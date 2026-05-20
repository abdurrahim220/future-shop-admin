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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { IProduct } from "@/types/productTypes";
import { toast } from "react-toastify";
import { useCreateProductMutation, useUpdateProductMutation } from "@/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/features/categories/categoriesApi";
import { useGetAllBrandsQuery } from "@/features/brand/brandApi";
import { useGetAllAttributesQuery } from "@/features/attribute/attributeApi";
import { Loader2 } from "lucide-react";

interface ProductFormProps {
  initialData?: IProduct | null;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  hasVariants: boolean;
  attributeIds: string[];
}

export default function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const { data: brandsResponse } = useGetAllBrandsQuery();
  const { data: attributesResponse } = useGetAllAttributesQuery();

  const categories = categoriesResponse?.data?.items || [];
  const brands = brandsResponse?.data?.items || [];
  const attributes = attributesResponse?.data || [];

  const form = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      brandId: initialData?.brandId || "",
      hasVariants: initialData?.hasVariants || false,
      attributeIds: initialData?.attributeIds || [],
    },
  });

  const hasVariants = form.watch("hasVariants");
  const selectedAttributes = form.watch("attributeIds") || [];
  const isLoading = isCreating || isUpdating;

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        brandId: values.brandId,
        hasVariants: values.hasVariants,
        attributeIds: values.hasVariants ? values.attributeIds : [],
      };

      if (initialData) {
        await updateProduct({ id: initialData._id, data: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Something went wrong");
    }
  };

  const handleAttributeToggle = (attributeId: string) => {
    const current = [...selectedAttributes];
    const index = current.indexOf(attributeId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(attributeId);
    }
    form.setValue("attributeIds", current);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Product name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
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
            name="brandId"
            rules={{ required: "Brand is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasVariants"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Multiple Variants</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable size, color, or other options for this product
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {hasVariants && (
          <div className="space-y-3 rounded-lg border p-4">
            <FormLabel className="text-base">Select Attributes</FormLabel>
            <p className="text-xs text-muted-foreground mb-2">
              Select attributes that this product supports.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {attributes.length === 0 ? (
                <p className="text-xs text-muted-foreground col-span-2">No attributes found. Please create attributes first.</p>
              ) : (
                attributes.map((attr) => (
                  <label
                    key={attr._id}
                    className="flex items-center gap-2 rounded-md border p-2.5 cursor-pointer hover:bg-accent text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAttributes.includes(attr._id)}
                      onChange={() => handleAttributeToggle(attr._id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{attr.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
