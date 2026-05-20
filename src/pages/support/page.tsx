import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Search, MessageSquare, User, Clock, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ITicket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  category: "Billing" | "Shipping" | "Account" | "Seller Dispute";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  message: string;
  replies: Array<{ sender: string; text: string; date: string }>;
  createdAt: string;
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [replyText, setReplyText] = useState("");

  const [tickets, setTickets] = useState<ITicket[]>([
    {
      id: "TK-4029",
      customerName: "Jane Doe",
      email: "jane.doe@gmail.com",
      subject: "Double-charged for Order #10023",
      category: "Billing",
      priority: "high",
      status: "open",
      message: "Hello support, I checked my bank statement and noticed I was charged twice for order #10023. Can you please issue a refund for the second transaction?",
      replies: [],
      createdAt: "2026-05-19T14:32:00Z"
    },
    {
      id: "TK-3918",
      customerName: "Alex Mercer",
      email: "alex.mercer@outlook.com",
      subject: "Address correction required",
      category: "Shipping",
      priority: "medium",
      status: "in_progress",
      message: "I put in the wrong zip code for my recent order. It should be 10001 instead of 10002. Please update it before it ships.",
      replies: [
        { sender: "Admin", text: "We have contacted the seller to hold fulfillment while we update the shipping address labels.", date: "2026-05-19T16:15:00Z" }
      ],
      createdAt: "2026-05-19T09:12:00Z"
    },
    {
      id: "TK-3811",
      customerName: "Vance Joy",
      email: "vance.j@live.com",
      subject: "Unable to complete seller registration",
      category: "Account",
      priority: "low",
      status: "resolved",
      message: "The trade license file upload is failing during seller application. I tried PDF and JPG format.",
      replies: [
        { sender: "Admin", text: "We resolved the file limit validation in the backend. Please try submitting again.", date: "2026-05-18T11:45:00Z" }
      ],
      createdAt: "2026-05-18T08:22:00Z"
    }
  ]);

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;

    setTickets(prev =>
      prev.map(tk => {
        if (tk.id === ticketId) {
          const updatedReplies = [
            ...tk.replies,
            { sender: "Admin", text: replyText, date: new Date().toISOString() }
          ];
          const updatedTicket = { ...tk, replies: updatedReplies, status: "in_progress" as const };
          setSelectedTicket(updatedTicket);
          return updatedTicket;
        }
        return tk;
      })
    );

    setReplyText("");
    toast.success("Reply submitted to customer");
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev =>
      prev.map(tk => {
        if (tk.id === ticketId) {
          const updatedTicket = { ...tk, status: "resolved" as const };
          setSelectedTicket(updatedTicket);
          return updatedTicket;
        }
        return tk;
      })
    );
    toast.success("Ticket marked as resolved");
  };

  const filteredTickets = tickets.filter(tk => {
    const matchesSearch = tk.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === "all" || tk.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || tk.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-muted-foreground">
            Manage customer complaints, technical inquiries, and seller disputes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ticket ID, subject or customer..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Only</SelectItem>
              <SelectItem value="medium">Medium Only</SelectItem>
              <SelectItem value="low">Low Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.length === 0 ? (
            <Card className="p-8 text-center bg-card/30 border-dashed border-2">
              <MessageSquare className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">No tickets match criteria</h3>
              <p className="text-sm text-muted-foreground">Try relaxing your search terms or filters.</p>
            </Card>
          ) : (
            filteredTickets.map(tk => (
              <Card
                key={tk.id}
                className="hover:bg-accent/30 cursor-pointer transition-colors border bg-card"
                onClick={() => setSelectedTicket(tk)}
              >
                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-muted-foreground">{tk.id}</span>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {tk.category}
                      </Badge>
                      <Badge
                        variant={tk.priority === "high" ? "destructive" : tk.priority === "medium" ? "outline" : "secondary"}
                        className={`text-[10px] capitalize ${tk.priority === "medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" : ""}`}
                      >
                        {tk.priority}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-base line-clamp-1">{tk.subject}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{tk.customerName} ({tk.email})</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{new Date(tk.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge
                      className="capitalize"
                      variant={tk.status === "resolved" ? "default" : tk.status === "open" ? "destructive" : "secondary"}
                    >
                      {tk.status.replace("_", " ")}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Ticket Modal Details */}
        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          {selectedTicket && (
            <DialogContent className="sm:max-w-[600px] bg-card">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-muted-foreground">{selectedTicket.id}</span>
                  <Badge variant="outline" className="text-[10px] capitalize">{selectedTicket.category}</Badge>
                  <Badge
                    variant={selectedTicket.priority === "high" ? "destructive" : selectedTicket.priority === "medium" ? "outline" : "secondary"}
                    className={`text-[10px] capitalize ${selectedTicket.priority === "medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" : ""}`}
                  >
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold">{selectedTicket.subject}</DialogTitle>
                <DialogDescription className="text-xs">
                  Submitted by {selectedTicket.customerName} ({selectedTicket.email}) on {new Date(selectedTicket.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              {/* Chat Thread */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto border rounded-lg p-4 bg-muted/40">
                {/* Initial message */}
                <div className="flex flex-col gap-1 max-w-[85%] bg-card p-3 rounded-lg text-sm border shadow-sm">
                  <div className="font-semibold text-xs text-primary flex items-center gap-1">
                    <User className="h-3 w-3" /> {selectedTicket.customerName}
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">{selectedTicket.message}</p>
                </div>

                {/* Replies */}
                {selectedTicket.replies.map((rep, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col gap-1 max-w-[85%] p-3 rounded-lg text-sm border shadow-sm ${
                      rep.sender === "Admin"
                        ? "bg-primary/5 border-primary/20 self-end ml-auto"
                        : "bg-card mr-auto"
                    }`}
                  >
                    <div className="font-semibold text-xs text-primary flex items-center gap-1">
                      <User className="h-3 w-3" /> {rep.sender}
                      <span className="text-[9px] text-muted-foreground ml-auto">
                        {new Date(rep.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/90">{rep.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply controls */}
              {selectedTicket.status !== "resolved" ? (
                <div className="space-y-3 pt-2">
                  <Textarea
                    placeholder="Type support reply or update actions here..."
                    className="min-h-[80px]"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="gap-1.5 border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10"
                      onClick={() => handleResolveTicket(selectedTicket.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Resolved
                    </Button>
                    <Button onClick={() => handleSendReply(selectedTicket.id)}>
                      Send Message
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center p-4 border border-dashed rounded-lg bg-emerald-500/5 text-emerald-500">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">This support inquiry has been marked as Resolved.</span>
                </div>
              )}
            </DialogContent>
          )}
        </Dialog>
      </div>
    </AdminLayoutWithAuth>
  );
}
