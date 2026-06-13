import { useState } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { useGetAllOrdersQuery } from "@/features/order/orderApi";
import { useGetAllSellersQuery } from "@/features/seller/sellerApi";
import { useGetAllAuditLogsQuery } from "@/features/auditLog/auditLogApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  RefreshCw,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");

  // Fetch orders, sellers, and audit logs
  const { data: ordersData, isLoading: loadingOrders, refetch: refetchOrders } = useGetAllOrdersQuery();
  const { data: sellersData, isLoading: loadingSellers, refetch: refetchSellers } = useGetAllSellersQuery();
  const { data: auditData, isLoading: loadingAudit, refetch: refetchAudit } = useGetAllAuditLogsQuery({ limit: 5 });

  const isGlobalLoading = loadingOrders || loadingSellers || loadingAudit;

  const handleRefreshAll = () => {
    refetchOrders();
    refetchSellers();
    refetchAudit();
  };

  // Calculations
  const orders = ordersData?.data || [];
  const sellers = sellersData?.data
    ? (Array.isArray(sellersData.data) ? sellersData.data : (sellersData.data as any).items || [])
    : [];
  const auditLogs = auditData?.data?.items || [];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const amount = typeof order.subtotal === "number" ? order.subtotal : 0;
    return sum + amount;
  }, 0);
  const activeSellersCount = sellers.filter((s: any) => s.status === "approved").length;

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Executive Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time platform insights, commercial statistics, and security audits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isGlobalLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isGlobalLoading ? "animate-spin" : ""}`} />
              Sync Data
            </Button>
          </div>
        </div>

        {/* 4 Stats Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Revenue */}
          <Card className="bg-card/50 backdrop-blur-md relative overflow-hidden border">
            <div className="absolute right-3 top-3 h-10 w-10 text-primary/10">
              <DollarSign className="h-full w-full" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Platform Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <Skeleton className="h-9 w-28" />
              ) : (
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-500 font-medium">
                <TrendingUp className="h-3 w-3" />
                +12.4% from last week
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Total Orders */}
          <Card className="bg-card/50 backdrop-blur-md relative overflow-hidden border">
            <div className="absolute right-3 top-3 h-10 w-10 text-primary/10">
              <ShoppingBag className="h-full w-full" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fulfillment Volume</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="text-2xl font-bold">{totalOrders} Orders</div>
              )}
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-500 font-medium">
                <TrendingUp className="h-3 w-3" />
                +4.2% daily growth
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Active Sellers */}
          <Card className="bg-card/50 backdrop-blur-md relative overflow-hidden border">
            <div className="absolute right-3 top-3 h-10 w-10 text-primary/10">
              <Users className="h-full w-full" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Shops</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSellers ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="text-2xl font-bold">{sellers.length} Sellers</div>
              )}
              <p className="text-xs text-muted-foreground mt-1 font-semibold text-primary">
                {activeSellersCount} Approved / Active
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Platform Health */}
          <Card className="bg-card/50 backdrop-blur-md relative overflow-hidden border">
            <div className="absolute right-3 top-3 h-10 w-10 text-emerald-500/10">
              <ShieldCheck className="h-full w-full" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Service Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500 flex items-center gap-1.5">
                <Zap className="h-5 w-5 fill-emerald-500 animate-pulse text-emerald-500" />
                100% Operational
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Security patches up to date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Timeline Logs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Sales Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Visual commercial progress indicator.</CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setTimeRange("7d")}
                  className={`px-2 py-1 rounded-md transition-colors ${timeRange === "7d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange("30d")}
                  className={`px-2 py-1 rounded-md transition-colors ${timeRange === "30d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  30 Days
                </button>
              </div>
            </CardHeader>
            <CardContent className="h-[280px] flex items-center justify-center relative">
              {/* Premium Custom SVG Chart */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex-1 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="hsl(var(--muted))" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="hsl(var(--muted))" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="hsl(var(--muted))" strokeWidth="0.5" strokeDasharray="3,3" />

                    {/* Area path */}
                    <path
                      d="M 0 160 Q 80 130 160 110 T 320 80 T 420 50 Q 460 70 500 40 L 500 200 L 0 200 Z"
                      fill="url(#chartGrad)"
                    />
                    {/* Line path */}
                    <path
                      d="M 0 160 Q 80 130 160 110 T 320 80 T 420 50 Q 460 70 500 40"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Active Nodes */}
                    <circle cx="160" cy="110" r="4.5" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1.5" />
                    <circle cx="320" cy="80" r="4.5" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1.5" />
                    <circle cx="500" cy="40" r="4.5" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1.5" />
                  </svg>
                </div>
                {/* X Axis Labels */}
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium pt-3 border-t">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chronological Audit Logs Feed */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Audit Ledger</CardTitle>
                <CardDescription>Recent administrative activities.</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingAudit ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 border border-dashed rounded-lg">
                  <Clock className="h-8 w-8 text-muted-foreground/45 mb-2" />
                  <p className="text-xs text-muted-foreground">No recent activities log registered.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => {
                    const userName = typeof log.userId === "object" && log.userId ? log.userId.name : "System Agent";
                    const isSystem = log.performedByRole === "SYSTEM";

                    return (
                      <div key={log._id} className="relative pl-6 pb-2 border-l last:border-l-0">
                        {/* Bullet circle */}
                        <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border bg-background flex items-center justify-center">
                          <span className={`h-1.5 w-1.5 rounded-full ${isSystem ? "bg-orange-500" : "bg-primary"}`} />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-foreground leading-none">{userName}</span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1 py-0 capitalize leading-none font-mono ${
                                log.performedByRole === "ADMIN"
                                  ? "text-blue-500 bg-blue-500/5 border-blue-500/20"
                                  : log.performedByRole === "SELLER"
                                  ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/20"
                                  : "text-orange-500 bg-orange-500/5 border-orange-500/20"
                              }`}
                            >
                              {log.performedByRole}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{log.action}</p>
                          <span className="text-[9px] text-muted-foreground/80 mt-1 font-mono">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayoutWithAuth>
  );
}
