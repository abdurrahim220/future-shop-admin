import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { IBanner } from "@/types/bannerTypes";
import { Edit2, Trash2, MoreHorizontal, ImageOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BannerTableProps {
  banners: IBanner[];
  onEdit: (banner: IBanner) => void;
  onDelete: (banner: IBanner) => void;
}

export default function BannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Banner Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No banners found.
              </TableCell>
            </TableRow>
          ) : (
            banners.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell>
                  <div className="relative aspect-[5/2] w-20 overflow-hidden rounded-md border bg-muted">
                    {banner.image?.small ? (
                      <img
                        src={banner.image.small}
                        alt={banner.name}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{banner.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(banner)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(banner)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
