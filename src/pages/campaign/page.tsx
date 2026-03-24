import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllCampaignsQuery, useDeleteCampaignMutation } from "@/features/campaign/campaignApi";
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
import CampaignTable from "@/components/campaign/CampaignTable";
import CampaignForm from "@/components/campaign/CampaignForm";
import type { ICampaign } from "@/types/campaignTypes";
import { Plus, Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CampaignPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ICampaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<ICampaign | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: campaignData, isLoading, isError, refetch, isFetching } = useGetAllCampaignsQuery({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const handleEdit = (campaign: ICampaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleDelete = (campaign: ICampaign) => {
    setDeletingCampaign(campaign);
  };

  const confirmDelete = async () => {
    if (!deletingCampaign) return;
    try {
      await deleteCampaign(deletingCampaign._id).unwrap();
      toast.success("Campaign deleted successfully");
      setDeletingCampaign(null);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete campaign");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCampaign(null);
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage your promotional campaigns and special offers.
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingCampaign ? "Edit Campaign" : "Add New Campaign"}</DialogTitle>
              </DialogHeader>
              <CampaignForm
                key={editingCampaign?._id || "new"}
                initialData={editingCampaign}
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
              placeholder="Search campaigns..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

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

        {/* Campaign Table */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Campaigns</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem fetching the campaigns. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <CampaignTable
              campaigns={campaignData?.data?.items || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {campaignData?.data?.meta && (
              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      campaignData.data.meta.total
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, campaignData.data.meta.total)}
                  </span>{" "}
                  of <span className="font-medium">{campaignData.data.meta.total}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isFetching}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {currentPage} of {campaignData.data.meta.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(campaignData.data.meta.totalPages, p + 1)
                      )
                    }
                    disabled={
                      currentPage === campaignData.data.meta.totalPages || isFetching
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingCampaign} onOpenChange={() => setDeletingCampaign(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the campaign{" "}
                <span className="font-semibold">{deletingCampaign?.title}</span> and remove its data
                from our servers.
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