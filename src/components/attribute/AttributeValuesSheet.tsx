import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useGetAllAttributeValuesQuery,
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useDeleteAttributeValueMutation,
} from "@/features/attributevalue/attributeValueApi";
import type { IAttribute } from "@/types/attributeTypes";
import type { IAttributeValue } from "@/types/attributeValueTypes";
import { Trash2, Edit2, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

interface AttributeValuesSheetProps {
  attribute: IAttribute | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AttributeValuesSheet({
  attribute,
  isOpen,
  onClose,
}: AttributeValuesSheetProps) {
  const [valueInput, setValueInput] = useState("");
  const [hexInput, setHexInput] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [editingValue, setEditingValue] = useState<IAttributeValue | null>(null);

  const {
    data: valuesResponse,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllAttributeValuesQuery(undefined, { skip: !attribute });

  const [createValue, { isLoading: isCreating }] = useCreateAttributeValueMutation();
  const [updateValue, { isLoading: isUpdating }] = useUpdateAttributeValueMutation();
  const [deleteValue, { isLoading: isDeleting }] = useDeleteAttributeValueMutation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attribute) return;
    if (!valueInput.trim()) {
      toast.error("Value name is required");
      return;
    }

    try {
      const payload = {
        attributeId: attribute._id,
        value: valueInput,
        hexCode: hexInput || undefined,
        sortOrder,
        isActive,
      };

      if (editingValue) {
        await updateValue({ id: editingValue._id, data: payload }).unwrap();
        toast.success("Value updated successfully");
      } else {
        await createValue(payload).unwrap();
        toast.success("Value added successfully");
      }

      resetForm();
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to save value");
    }
  };

  const handleEdit = (val: IAttributeValue) => {
    setEditingValue(val);
    setValueInput(val.value);
    setHexInput(val.hexCode || "");
    setSortOrder(val.sortOrder || 0);
    setIsActive(val.isActive);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteValue(id).unwrap();
      toast.success("Value deleted successfully");
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete value");
    }
  };

  const resetForm = () => {
    setEditingValue(null);
    setValueInput("");
    setHexInput("");
    setSortOrder(0);
    setIsActive(true);
  };

  const allValues = valuesResponse?.data || [];
  const filteredValues = allValues.filter((val) => val.attributeId === attribute?._id);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configure Values</SheetTitle>
          <SheetDescription>
            Manage selectable values for the <span className="font-semibold">{attribute?.name}</span> attribute.
          </SheetDescription>
        </SheetHeader>

        {/* Add/Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 my-6 rounded-lg border p-4 bg-muted/40">
          <h4 className="text-sm font-semibold">
            {editingValue ? "Edit Value Option" : "Add Value Option"}
          </h4>

          <div className="space-y-2">
            <Label htmlFor="val-name">Value / Label</Label>
            <Input
              id="val-name"
              placeholder="e.g. Red, Medium, XL, 10"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
            />
          </div>

          {(attribute?.type === "color" || attribute?.type === "image") && (
            <div className="space-y-2">
              <Label htmlFor="hex-code">Hex Code / Color Swatch (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="hex-code"
                  placeholder="e.g. #FF0000"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  className="font-mono"
                />
                {hexInput && (
                  <div
                    className="h-10 w-10 rounded-md border"
                    style={{ backgroundColor: hexInput }}
                  />
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort-order">Sort Order</Label>
              <Input
                id="sort-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="flex flex-col justify-end pb-1.5">
              <div className="flex items-center justify-between gap-2 rounded-md border p-2 bg-background">
                <span className="text-xs text-muted-foreground">Active</span>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {editingValue && (
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
              {editingValue ? "Update Value" : "Add Value"}
            </Button>
          </div>
        </form>

        {/* Existing Values List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Configured Values</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
            </div>
          ) : filteredValues.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md">
              No values added yet. Use the form above to add a value.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredValues.map((val) => (
                <div
                  key={val._id}
                  className="flex items-center justify-between border rounded-md p-3 bg-card"
                >
                  <div className="flex items-center gap-3">
                    {val.hexCode && (
                      <div
                        className="h-5 w-5 rounded-full border shadow-sm"
                        style={{ backgroundColor: val.hexCode }}
                      />
                    )}
                    <div>
                      <span className="text-sm font-medium">{val.value}</span>
                      <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                        (Order: {val.sortOrder})
                      </span>
                    </div>
                    <Badge variant={val.isActive ? "default" : "secondary"} className="text-[9px] px-1 py-0 h-4">
                      {val.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(val)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(val._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
