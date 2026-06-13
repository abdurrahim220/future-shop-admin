import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { IProduct, IProductVariant } from "@/types/productTypes";
import { toast } from "react-toastify";
import {
  useGetProductByIdQuery,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useUploadFilesMutation,
} from "@/features/product/productApi";
import { useGetAllAttributesQuery } from "@/features/attribute/attributeApi";
import { useGetAllAttributeValuesQuery } from "@/features/attributevalue/attributeValueApi";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";

interface VariantsManagerProps {
  product: IProduct;
  onSuccess?: () => void;
}

interface NewVariantFormValues {
  sku: string;
  purchasePrice: number;
  salePrice: number;
  attributes: Record<string, string>; // attributeId -> attributeValueId
}

export default function VariantsManager({ product, onSuccess }: VariantsManagerProps) {
  const { data: productResponse, refetch, isLoading: isProductLoading } = useGetProductByIdQuery(product._id);
  const { data: attributesResponse } = useGetAllAttributesQuery();
  const { data: attrValuesResponse } = useGetAllAttributeValuesQuery();

  const [createVariant, { isLoading: isCreatingVariant }] = useCreateVariantMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] = useUpdateVariantMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();

  const [editingVariant, setEditingVariant] = useState<IProductVariant | null>(null);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [variantImages, setVariantImages] = useState<string[]>([]);

  const productData = productResponse?.data;
  const variants = productData?.variants || [];
  const attributes = attributesResponse?.data || [];
  const allAttributeValues = attrValuesResponse?.data || [];

  // Filter attributes that this product supports
  const supportedAttributes = attributes.filter((attr) =>
    product.attributeIds.includes(attr._id)
  );

  const { register, handleSubmit, setValue, watch, reset } = useForm<NewVariantFormValues>({
    defaultValues: {
      sku: "",
      purchasePrice: 0,
      salePrice: 0,
      attributes: {},
    },
  });

  const selectedAttrValues = watch("attributes") || {};

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, forEdit = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await uploadFiles(formData).unwrap();
      if (res.success && res.data) {
        if (forEdit && editingVariant) {
          setEditingVariant((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              images: [...(prev.images || []), ...res.data!],
            };
          });
        } else {
          setVariantImages((prev) => [...prev, ...res.data!]);
        }
        toast.success("Images uploaded successfully");
      }
    } catch {
      toast.error("Failed to upload images");
    }
  };

  const handleRemoveImage = (index: number, forEdit = false) => {
    if (forEdit && editingVariant) {
      setEditingVariant((prev) => {
        if (!prev) return null;
        const copy = [...(prev.images || [])];
        copy.splice(index, 1);
        return {
          ...prev,
          images: copy,
        };
      });
    } else {
      setVariantImages((prev) => {
        const copy = [...prev];
        copy.splice(index, 1);
        return copy;
      });
    }
  };

  const onAddVariantSubmit = async (values: NewVariantFormValues) => {
    if (variantImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    // Convert attributes object to the schema format
    const attributeValues = Object.entries(values.attributes).map(([attrId, valId]) => ({
      attributeId: attrId,
      attributeValueId: valId,
    }));

    if (attributeValues.length !== supportedAttributes.length) {
      toast.error("Please select values for all attributes");
      return;
    }

    try {
      const payload = {
        sku: values.sku,
        purchasePrice: Number(values.purchasePrice),
        salePrice: Number(values.salePrice),
        images: variantImages,
        attributeValues,
      };

      await createVariant({ productId: product._id, data: payload }).unwrap();
      toast.success("Variant created successfully");
      setIsAddingVariant(false);
      setVariantImages([]);
      reset();
      refetch();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create variant");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingVariant) return;

    try {
      const payload = {
        sku: editingVariant.sku,
        purchasePrice: Number(editingVariant.purchasePrice),
        salePrice: Number(editingVariant.salePrice),
        images: editingVariant.images || [],
      };

      await updateVariant({
        productId: product._id,
        variantId: editingVariant._id,
        data: payload,
      }).unwrap();

      toast.success("Variant updated successfully");
      setEditingVariant(null);
      refetch();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update variant");
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 1. Standard Product flow (Non-Variant)
  if (!product.hasVariants) {
    const defaultVar = variants.find((v: IProductVariant) => v.isDefault) || variants[0];

    if (!defaultVar) {
      return (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No default variant found. Try reloading page.
        </div>
      );
    }

    const editTarget = editingVariant || defaultVar;

    return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        <p className="text-sm text-muted-foreground">
          Update the price and images for this standard catalog product.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price (৳)</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={editTarget.purchasePrice}
              onChange={(e) =>
                setEditingVariant({
                  ...editTarget,
                  purchasePrice: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salePrice">Sale Price (৳)</Label>
            <Input
              id="salePrice"
              type="number"
              value={editTarget.salePrice}
              onChange={(e) =>
                setEditingVariant({
                  ...editTarget,
                  salePrice: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label>Product Images</Label>
          <div className="grid grid-cols-4 gap-3">
            {editTarget.images?.map((url: string, idx: number) => (
              <div key={idx} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
                <img src={url} className="object-cover h-full w-full" alt="" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx, true)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90 transition-opacity"
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
                  <Plus className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">Upload</span>
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => handleImageUpload(e, true)}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSaveEdit}
            disabled={isUpdatingVariant}
            className="w-full sm:w-auto"
          >
            {isUpdatingVariant && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Price & Images
          </Button>
        </div>
      </div>
    );
  }

  // 2. Multi-Variant Product flow
  return (
    <div className="space-y-6 max-h-[85vh] overflow-y-auto px-1">
      {/* Existing Variants List */}
      {!isAddingVariant && !editingVariant && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">Product Options & Pricing</h3>
            <Button size="sm" onClick={() => setIsAddingVariant(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Custom Variant
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU / Options</TableHead>
                  <TableHead>Purchase (৳)</TableHead>
                  <TableHead>Sale (৳)</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                      No options defined. Add options to sell this product.
                    </TableCell>
                  </TableRow>
                ) : (
                  variants.map((v: IProductVariant) => {
                    const attrText = v.attributeValues
                      .map((val: any) => {
                        const matchedVal = allAttributeValues.find((av: any) => av._id === val.attributeValueId);
                        return matchedVal?.value || "N/A";
                      })
                      .join(" / ");

                    return (
                      <TableRow key={v._id}>
                        <TableCell>
                          <div className="font-semibold text-sm">{v.sku}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{attrText}</div>
                        </TableCell>
                        <TableCell>৳{v.purchasePrice}</TableCell>
                        <TableCell>৳{v.salePrice}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {v.images?.slice(0, 3).map((img: string, idx: number) => (
                              <img key={idx} src={img} className="h-7 w-7 rounded border object-cover bg-muted" alt="" />
                            ))}
                            {(v.images?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                                +{v.images.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingVariant(v)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Editing Variant Panel */}
      {editingVariant && (
        <div className="space-y-5 border rounded-lg p-4 bg-muted/20">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-sm">Edit Variant: {editingVariant.sku}</h3>
            <Button size="sm" variant="ghost" onClick={() => setEditingVariant(null)}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Purchase Price (৳)</Label>
              <Input
                type="number"
                value={editingVariant.purchasePrice}
                onChange={(e) =>
                  setEditingVariant({ ...editingVariant, purchasePrice: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Sale Price (৳)</Label>
              <Input
                type="number"
                value={editingVariant.salePrice}
                onChange={(e) =>
                  setEditingVariant({ ...editingVariant, salePrice: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Variant Images</Label>
            <div className="grid grid-cols-4 gap-3">
              {editingVariant.images?.map((url: string, idx: number) => (
                <div key={idx} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
                  <img src={url} className="object-cover h-full w-full" alt="" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx, true)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/95 transition-opacity"
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
                    <Plus className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => handleImageUpload(e, true)}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditingVariant(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdatingVariant}>
              {isUpdatingVariant && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Adding Variant Panel */}
      {isAddingVariant && (
        <form onSubmit={handleSubmit(onAddVariantSubmit)} className="space-y-5 border rounded-lg p-4 bg-muted/20">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-sm">Add New Custom Variant</h3>
            <Button size="sm" variant="ghost" type="button" onClick={() => setIsAddingVariant(false)}>
              Cancel
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU Code</Label>
            <Input id="sku" placeholder="e.g. IPHONE-16-BLK-256" {...register("sku", { required: "SKU is required" })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPurchasePrice">Purchase Price (৳)</Label>
              <Input
                id="newPurchasePrice"
                type="number"
                {...register("purchasePrice", { required: true, min: 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newSalePrice">Sale Price (৳)</Label>
              <Input
                id="newSalePrice"
                type="number"
                {...register("salePrice", { required: true, min: 1 })}
              />
            </div>
          </div>

          {/* Dynamic option selects based on supported attributes */}
          <div className="space-y-3 rounded-lg border p-4 bg-background">
            <Label className="text-sm font-semibold">Configure Variant Options</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supportedAttributes.map((attr) => {
                const valuesForAttr = allAttributeValues.filter((v) => v.attributeId === attr._id);

                return (
                  <div key={attr._id} className="space-y-1.5">
                    <Label className="text-xs uppercase text-muted-foreground">{attr.name}</Label>
                    <Select
                      value={selectedAttrValues[attr._id] || ""}
                      onValueChange={(val) => setValue(`attributes.${attr._id}`, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${attr.name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {valuesForAttr.map((val) => (
                          <SelectItem key={val._id} value={val._id}>
                            {val.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Variant Images Upload */}
          <div className="space-y-2">
            <Label>Upload Images</Label>
            <div className="grid grid-cols-4 gap-3">
              {variantImages.map((url: string, idx: number) => (
                <div key={idx} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
                  <img src={url} className="object-cover h-full w-full" alt="" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/95 transition-opacity"
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
                    <Plus className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => handleImageUpload(e)}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setIsAddingVariant(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingVariant}>
              {isCreatingVariant && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Variant
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
