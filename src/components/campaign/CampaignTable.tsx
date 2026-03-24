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
import type { ICampaign } from "@/types/campaignTypes";
import { Edit2, Trash2, MoreHorizontal, ImageOff, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CampaignTableProps {
  campaigns: ICampaign[];
  onEdit: (campaign: ICampaign) => void;
  onDelete: (campaign: ICampaign) => void;
}

export default function CampaignTable({ campaigns, onEdit, onDelete }: CampaignTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "scheduled":
        return "outline";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Banner</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No campaigns found.
              </TableCell>
            </TableRow>
          ) : (
            campaigns?.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell>
                  <div className="h-12 w-20 overflow-hidden rounded-md border bg-muted">
                    {campaign.bannerImg?.small ? (
                      <img
                        src={campaign.bannerImg.small}
                        alt={campaign.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3"></span>
                      to {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : "-"}
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
                      <DropdownMenuItem onClick={() => onEdit(campaign)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(campaign)}
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
