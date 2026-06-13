import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
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
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadFilesMutation,
  useUpdateVariantMutation,
  useLazyGetProductByIdQuery,
} from "@/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/features/categories/categoriesApi";
import { useGetAllBrandsQuery } from "@/features/brand/brandApi";
import { useGetAllAttributesQuery } from "@/features/attribute/attributeApi";
import { useGetAllBranchesQuery } from "@/features/branches/branchApi";
import {
  useCreateBranchInventoryMutation,
  useUpdateBranchInventoryMutation,
  useGetAllBranchInventoriesQuery,
} from "@/features/branchinventory/branchInventoryApi";
import { Loader2, Trash2, UploadCloud } from "lucide-react";

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
  purchasePrice?: number;
  salePrice?: number;
  stock?: Record<string, number>;
}

export default function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] = useUpdateVariantMutation();
  const [createBranchInventory] = useCreateBranchInventoryMutation();
  const [updateBranchInventory] = useUpdateBranchInventoryMutation();
  const [getProductById] = useLazyGetProductByIdQuery();

  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const { data: brandsResponse } = useGetAllBrandsQuery();
  const { data: attributesResponse } = useGetAllAttributesQuery();
  const { data: branchesResponse } = useGetAllBranchesQuery();
  const { data: inventoriesData } = useGetAllBranchInventoriesQuery();

  const categories = categoriesResponse?.data?.items || [];
  const brands = brandsResponse?.data?.items || [];
  const attributes = attributesResponse?.data || [];
  const branches = (branchesResponse?.data || []) as any[];
  const productInventories = inventoriesData?.data
    ? (Array.isArray(inventoriesData.data) ? inventoriesData.data : (inventoriesData.data as any).items || [])
    : [];

  const defaultVar = initialData && !initialData.hasVariants
    ? (initialData.variants?.find((v) => v.isDefault) || initialData.variants?.[0])
    : null;

  const [productImages, setProductImages] = useState<string[]>(defaultVar?.images || []);

  const form = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      categoryId: typeof initialData?.categoryId === "object"
        ? initialData.categoryId._id
        : initialData?.categoryId || "",
      brandId: typeof initialData?.brandId === "object"
        ? initialData.brandId._id
        : initialData?.brandId || "",
      hasVariants: initialData?.hasVariants || false,
      attributeIds: initialData?.attributeIds || [],
      purchasePrice: defaultVar?.purchasePrice || 0,
      salePrice: defaultVar?.salePrice || 0,
      stock: {},
    },
  });

  const hasVariants = form.watch("hasVariants");
  const selectedAttributes = form.watch("attributeIds") || [];
  const isLoading = isCreating || isUpdating || isUpdatingVariant || isUploading;

  // Asynchronously populate stocks when inventories are loaded
  useEffect(() => {
    if (initialData && defaultVar && productInventories.length > 0) {
      const stock: Record<string, number> = {};
      productInventories
        .filter((inv: any) => {
          const invProdId = typeof inv.productId === "object" ? inv.productId?._id : inv.productId;
          const invVarId = typeof inv.variantId === "object" ? inv.variantId?._id : inv.variantId;
          return invProdId === initialData._id && invVarId === defaultVar._id;
        })
        .forEach((inv: any) => {
          const branchId = typeof inv.branchId === "object" ? inv.branchId?._id : inv.branchId;
          if (branchId) {
            stock[branchId] = inv.stock;
          }
        });

      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        categoryId: typeof initialData.categoryId === "object" ? initialData.categoryId._id : initialData.categoryId,
        brandId: typeof initialData.brandId === "object" ? initialData.brandId._id : initialData.brandId,
        hasVariants: initialData.hasVariants,
        attributeIds: initialData.attributeIds || [],
        purchasePrice: defaultVar.purchasePrice,
        salePrice: defaultVar.salePrice,
        stock,
      });
      setProductImages(defaultVar.images || []);
    }
  }, [inventoriesData, initialData]);

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

      let createdProductData: IProduct | undefined;

      if (initialData) {
        const res = await updateProduct({ id: initialData._id, data: payload }).unwrap();
        createdProductData = res.data;
        toast.success("Product updated successfully");
      } else {
        const res = await createProduct(payload).unwrap();
        createdProductData = res.data;
        toast.success("Product created successfully");
      }

      // If simple product (no variants), update default variant and inventories
      if (!values.hasVariants && createdProductData) {
        const productId = createdProductData._id;

        // 1. Fetch details to find the default variant
        const productDetails = await getProductById(productId).unwrap();
        const defaultVariant = productDetails.data.variants?.find((v: any) => v.isDefault) || productDetails.data.variants?.[0];

        if (defaultVariant) {
          const variantId = defaultVariant._id;

          // 2. Update default variant price & images
          await updateVariant({
            productId,
            variantId,
            data: {
              sku: defaultVariant.sku,
              purchasePrice: Number(values.purchasePrice || 0),
              salePrice: Number(values.salePrice || 0),
              images: productImages,
              attributeValues: [],
            },
          }).unwrap();

          // 3. Save stock per branch
          if (values.stock) {
            const promises = Object.entries(values.stock).map(async ([branchId, stockQty]) => {
              const qty = Number(stockQty || 0);

              const existingInv = productInventories.find((inv: any) => {
                const invProdId = typeof inv.productId === "object" ? inv.productId?._id : inv.productId;
                const invVarId = typeof inv.variantId === "object" ? inv.variantId?._id : inv.variantId;
                const invBranchId = typeof inv.branchId === "object" ? inv.branchId?._id : inv.branchId;
                return invProdId === productId && invVarId === variantId && invBranchId === branchId;
              });

              if (existingInv) {
                return updateBranchInventory({
                  id: existingInv._id,
                  data: { stock: qty },
                }).unwrap();
              } else {
                return createBranchInventory({
                  productId,
                  variantId,
                  branchId,
                  stock: qty,
                  reorderLevel: 0,
                }).unwrap();
              }
            });
            await Promise.all(promises);
          }
        }
      }

      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Something went wrong");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await uploadFiles(formData).unwrap();
      if (res.success && res.data) {
        setProductImages((prev) => [...prev, ...res.data!]);
        toast.success("Images uploaded successfully");
      }
    } catch {
      toast.error("Failed to upload images");
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
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

        {!hasVariants && (
          <div className="space-y-6 border rounded-lg p-4 bg-muted/10">
            <h3 className="text-base font-semibold border-b pb-1">Standard Product Details</h3>
            
            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2.5">
              <Label>Product Images</Label>
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
                    <img src={url} className="object-cover h-full w-full" alt="" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/95"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer hover:bg-accent/40 aspect-square min-h-24">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Stock Levels */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Stock Management (per Location)</Label>
              <div className="border rounded-lg p-3 bg-background space-y-3 divide-y">
                {branches.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">No branches configured.</p>
                ) : (
                  branches.map((branch) => (
                    <div key={branch._id} className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">{branch.branchName}</Label>
                        <p className="text-xs text-muted-foreground capitalize">{branch.city} • {branch.type}</p>
                      </div>
                      <div className="w-28">
                        <Input
                          type="number"
                          placeholder="0"
                          className="text-right"
                          {...form.register(`stock.${branch._id}`, { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

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
