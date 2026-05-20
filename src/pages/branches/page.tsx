import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllBranchesQuery, useDeleteBranchMutation } from "@/features/branches/branchApi";
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
import BranchTable from "@/components/branches/BranchTable";
import BranchForm from "@/components/branches/BranchForm";
import type { IBranch } from "@/types/branchTypes";
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

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<IBranch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<IBranch | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: branchesData, isLoading, isError, refetch, isFetching } = useGetAllBranchesQuery({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const handleEdit = (branch: IBranch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (branch: IBranch) => {
    setDeletingBranch(branch);
  };

  const confirmDelete = async () => {
    if (!deletingBranch) return;
    try {
      await deleteBranch(deletingBranch._id).unwrap();
      toast.success("Branch deleted successfully");
      setDeletingBranch(null);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete branch");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBranch(null);
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
            <p className="text-muted-foreground">
              Manage physical stores and fulfillment warehouse locations.
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
              </DialogHeader>
              <BranchForm
                key={editingBranch?._id || "new"}
                initialData={editingBranch}
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
              placeholder="Search by name or code..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="store">Store</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Table Content */}
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
            <h3 className="text-lg font-semibold">Error Loading Branches</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem fetching branch configurations. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <BranchTable
              branches={branchesData?.data?.items || []}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />

            {/* Pagination */}
            {branchesData?.data?.meta && branchesData.data.meta.totalPages > 0 && (
              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      branchesData.data.meta.total
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, branchesData.data.meta.total)}
                  </span>{" "}
                  of <span className="font-medium">{branchesData.data.meta.total}</span> results
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
                    Page {currentPage} of {branchesData.data.meta.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(branchesData.data.meta.totalPages, p + 1)
                      )
                    }
                    disabled={
                      currentPage === branchesData.data.meta.totalPages || isFetching
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
        <AlertDialog open={!!deletingBranch} onOpenChange={() => setDeletingBranch(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the branch{" "}
                <span className="font-semibold">{deletingBranch?.branchName}</span> ({deletingBranch?.branchCode}) and remove its stock associations.
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
