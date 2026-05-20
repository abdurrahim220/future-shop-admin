import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import {
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} from "@/features/reviews/reviewApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import ReviewTable from "@/components/reviews/ReviewTable";
import type { IReview } from "@/types/reviewTypes";
import { Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deletingReview, setDeletingReview] = useState<IReview | null>(null);

  const { data: reviewsData, isLoading, isError, refetch, isFetching } = useGetAllReviewsQuery({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
    page: currentPage,
    limit: itemsPerPage,
  });

  const [updateReviewStatus] = useUpdateReviewStatusMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const handleApprove = async (id: string) => {
    try {
      await updateReviewStatus({ id, status: "approved" }).unwrap();
      toast.success("Review approved successfully");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to approve review");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateReviewStatus({ id, status: "rejected" }).unwrap();
      toast.info("Review hidden/rejected");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to reject review");
    }
  };

  const confirmDelete = async () => {
    if (!deletingReview) return;
    try {
      await deleteReview(deletingReview._id).unwrap();
      toast.success("Review permanently deleted");
      setDeletingReview(null);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete review");
    }
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Reviews</h1>
            <p className="text-muted-foreground">
              Moderate ratings and text feedback submitted by verified buyers.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh List
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search comments or users..."
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
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={ratingFilter}
            onValueChange={(value) => {
              setRatingFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table / Grid */}
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
            <h3 className="text-lg font-semibold">Error Loading Reviews</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem querying the product comments. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ReviewTable
              reviews={reviewsData?.data?.items || []}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={(review) => setDeletingReview(review)}
            />

            {/* Pagination */}
            {reviewsData?.data?.meta && reviewsData.data.meta.totalPages > 0 && (
              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      reviewsData.data.meta.total
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, reviewsData.data.meta.total)}
                  </span>{" "}
                  of <span className="font-medium">{reviewsData.data.meta.total}</span> results
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
                    Page {currentPage} of {reviewsData.data.meta.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(reviewsData.data.meta.totalPages, p + 1)
                      )
                    }
                    disabled={
                      currentPage === reviewsData.data.meta.totalPages || isFetching
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
        <AlertDialog open={!!deletingReview} onOpenChange={() => setDeletingReview(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the review and remove it from the product's ratings average.
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