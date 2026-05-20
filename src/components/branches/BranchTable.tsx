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
import type { IBranch } from "@/types/branchTypes";
import { Edit2, Trash2, MoreHorizontal, MapPin, Phone, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BranchTableProps {
  branches: IBranch[];
  onEdit: (branch: IBranch) => void;
  onDelete: (branch: IBranch) => void;
}

export default function BranchTable({ branches, onEdit, onDelete }: BranchTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code & Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden lg:table-cell">Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No branches found.
              </TableCell>
            </TableRow>
          ) : (
            branches.map((branch) => (
              <TableRow key={branch._id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{branch.branchName}</span>
                    <span className="text-xs text-muted-foreground font-mono">{branch.branchCode}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={branch.type === "warehouse" ? "outline" : "secondary"} className="capitalize">
                    <Building2 className="mr-1 h-3 w-3" />
                    {branch.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Phone className="h-3 w-3" />
                    {branch.phone || "No phone"}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  <div className="flex items-start gap-1.5 text-xs">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span>{branch.address}</span>
                      <span className="text-muted-foreground/80">{branch.city}, {branch.state}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={branch.status === "active" ? "default" : "destructive"} className="capitalize">
                    {branch.status}
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(branch)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(branch)}
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
