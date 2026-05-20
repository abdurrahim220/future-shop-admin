import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllAttributesQuery, useDeleteAttributeMutation } from "@/features/attribute/attributeApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AttributeTable from "@/components/attribute/AttributeTable";
import AttributeForm from "@/components/attribute/AttributeForm";
import AttributeValuesSheet from "@/components/attribute/AttributeValuesSheet";
import type { IAttribute } from "@/types/attributeTypes";
import { Plus, Search, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttributePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<IAttribute | null>(null);
  const [deletingAttr, setDeletingAttr] = useState<IAttribute | null>(null);
  const [valManagementAttr, setValManagementAttr] = useState<IAttribute | null>(null);

  const { data: attributesResponse, isLoading, isError, refetch, isFetching } = useGetAllAttributesQuery();
  const [deleteAttribute, { isLoading: isDeleting }] = useDeleteAttributeMutation();

  const handleEdit = (attribute: IAttribute) => {
    setEditingAttr(attribute);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (attribute: IAttribute) => {
    setDeletingAttr(attribute);
  };

  const handleManageValues = (attribute: IAttribute) => {
    setValManagementAttr(attribute);
  };

  const confirmDelete = async () => {
    if (!deletingAttr) return;
    try {
      await deleteAttribute(deletingAttr._id).unwrap();
      toast.success("Attribute deleted successfully");
      setDeletingAttr(null);
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete attribute");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAttr(null);
  };

  const attributes = attributesResponse?.data || [];
  const filteredAttributes = attributes.filter((attr) =>
    attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attr.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attributes</h1>
            <p className="text-muted-foreground">
              Define product parameters (e.g. Size, Color) used for creating product variants.
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Attribute
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingAttr ? "Edit Attribute" : "Add New Attribute"}</DialogTitle>
              </DialogHeader>
              <AttributeForm
                key={editingAttr?._id || "new"}
                initialData={editingAttr}
                onSuccess={() => {
                  handleCloseForm();
                  refetch();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search attributes..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Attribute Table */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Attributes</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem fetching the attributes. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AttributeTable
              attributes={filteredAttributes}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onManageValues={handleManageValues}
            />
            <div className="text-xs text-muted-foreground">
              Total {filteredAttributes.length} attribute(s) configured.
            </div>
          </div>
        )}

        {/* Attribute Values Configuration Sheet */}
        <AttributeValuesSheet
          attribute={valManagementAttr}
          isOpen={!!valManagementAttr}
          onClose={() => setValManagementAttr(null)}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingAttr} onOpenChange={() => setDeletingAttr(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the attribute{" "}
                <span className="font-semibold">{deletingAttr?.name}</span> and remove its configured values.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayoutWithAuth>
  );
}
