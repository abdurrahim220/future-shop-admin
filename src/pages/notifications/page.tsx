import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} from "@/features/notifications/notificationApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, Trash2, CheckCircle2, Mail, MailOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

export default function NotificationsPage() {
  const currentPage = 1;

  const { data: response, isLoading, isError, refetch, isFetching } = useGetAllNotificationsQuery({
    page: currentPage.toString(),
  });

  const [updateNotification, { isLoading: isUpdating }] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notificationsList = response?.data || [];

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateNotification({ id, data: { isRead: true } }).unwrap();
      toast.success("Notification marked as read");
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to update notification");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted");
      refetch();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to delete notification");
    }
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Notifications</h1>
            <p className="text-muted-foreground">
              Review real-time audit system notifications, seller request warnings, and operational events.
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-destructive/5">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Notifications</h3>
            <p className="text-muted-foreground mb-4">
              Failed to load system notifications. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {notificationsList.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg bg-card text-muted-foreground">
                No notifications logged.
              </div>
            ) : (
              <div className="grid gap-3">
                {notificationsList.map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-start justify-between p-4 rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md ${
                      notification.isRead ? "bg-card border-muted/50" : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {notification.isRead ? (
                          <MailOpen className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm capitalize">{notification.type || "System alert"}</span>
                          {!notification.isRead && (
                            <Badge className="bg-primary/20 text-primary border-none hover:bg-primary/30">New</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                        <span className="text-xs text-muted-foreground/60 block mt-2">
                          {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleMarkAsRead(notification._id)}
                          title="Mark as Read"
                          disabled={isUpdating}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        onClick={() => handleDelete(notification._id)}
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayoutWithAuth>
  );
}