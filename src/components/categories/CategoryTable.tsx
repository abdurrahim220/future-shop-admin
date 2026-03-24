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
import type { ICategory } from "@/types/categoryTypes";
import { Edit2, Trash2, MoreHorizontal, ImageOff, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryTableProps {
  categories: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Slug</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories?.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted">
                    {category.icon?.small ? (
                      <img
                        src={category.icon.small}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {category.slug}
                </TableCell>
                <TableCell>
                  {category.isFeatured ? (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                      <Star className="mr-1 h-3 w-3 fill-current" /> Featured
                    </Badge>
                  ) : (
                    <Badge variant="outline">Standard</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "-"}
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
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(category)}
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
