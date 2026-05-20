import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IReview } from "@/types/reviewTypes";
import { Star, Check, X, Trash2, MoreHorizontal, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewTableProps {
  reviews: IReview[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (review: IReview) => void;
}

export default function ReviewTable({ reviews, onApprove, onReject, onDelete }: ReviewTableProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
          }`}
        />
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="w-[30%]">Comment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => {
              const customerName = typeof review.userId === "object" && review.userId ? review.userId.name : "Anonymous Customer";
              const customerEmail = typeof review.userId === "object" && review.userId ? review.userId.email : "";
              const productName = typeof review.productId === "object" && review.productId ? review.productId.name : "Unknown Product";

              return (
                <TableRow key={review._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{customerName}</span>
                      {customerEmail && (
                        <span className="text-xs text-muted-foreground font-mono">{customerEmail}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium line-clamp-1 text-sm">{productName}</span>
                  </TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1.5 py-1">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {review.comment || "No text feedback provided"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        review.status === "approved"
                          ? "default"
                          : review.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Review Moderation</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {review.status !== "approved" && (
                          <DropdownMenuItem onClick={() => onApprove(review._id)} className="text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500">
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {review.status !== "rejected" && (
                          <DropdownMenuItem onClick={() => onReject(review._id)} className="text-amber-500 focus:bg-amber-500/10 focus:text-amber-500">
                            <X className="mr-2 h-4 w-4" />
                            Reject/Hide
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(review)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
