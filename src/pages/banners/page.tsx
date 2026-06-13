import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllBannersQuery, useDeleteBannerMutation } from "@/features/banner/bannerApi";
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
import BannerTable from "@/components/banners/BannerTable";
import BannerForm from "@/components/banners/BannerForm";
import type { IBanner } from "@/types/bannerTypes";
import { Plus, Search, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

export default function BannersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<IBanner | null>(null);

  const { data: bannersData, isLoading, isError, refetch, isFetching } = useGetAllBannersQuery();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const handleEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (banner: IBanner) => {
    setDeletingBanner(banner);
  };

  const confirmDelete = async () => {
    if (!deletingBanner) return;
    try {
      await deleteBanner(deletingBanner._id).unwrap();
      toast.success("Banner deleted successfully");
      setDeletingBanner(null);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete banner");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
  };

  // Client side search filtering
  const filteredBanners = bannersData?.data?.filter((banner) =>
    banner.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hero Banners</h1>
            <p className="text-muted-foreground">
              Manage promotional banners displayed on the shop's homepage.
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
              </DialogHeader>
              <BannerForm
                key={editingBanner?._id || "new"}
                initialData={editingBanner}
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
              placeholder="Search banners..."
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

        {/* Table View */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Banners</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem fetching the banners. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <BannerTable
            banners={filteredBanners}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingBanner} onOpenChange={() => setDeletingBanner(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the banner{" "}
                <span className="font-semibold">{deletingBanner?.name}</span> and remove its image from
                Cloudinary.
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
