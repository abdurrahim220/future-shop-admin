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
import type { IAttribute } from "@/types/attributeTypes";
import { Edit2, Trash2, MoreHorizontal, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttributeTableProps {
  attributes: IAttribute[];
  onEdit: (attribute: IAttribute) => void;
  onDelete: (attribute: IAttribute) => void;
  onManageValues: (attribute: IAttribute) => void;
}

export default function AttributeTable({
  attributes,
  onEdit,
  onDelete,
  onManageValues,
}: AttributeTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Attribute Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attributes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No attributes found.
              </TableCell>
            </TableRow>
          ) : (
            attributes.map((attr) => (
              <TableRow key={attr._id}>
                <TableCell className="font-medium">{attr.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{attr.slug}</TableCell>
                <TableCell className="capitalize text-xs">{attr.type}</TableCell>
                <TableCell>
                  <Badge variant={attr.isActive ? "default" : "secondary"}>
                    {attr.isActive ? "Active" : "Inactive"}
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
                      <DropdownMenuItem onClick={() => onManageValues(attr)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Values
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(attr)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Attribute
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(attr)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Attribute
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
