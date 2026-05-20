export interface IAuditChange {
  from: unknown;
  to: unknown;
}

export interface IAuditLog {
  _id: string;
  userId?: string | { _id: string; name: string; email: string };
  performedByRole: "ADMIN" | "SELLER" | "SYSTEM" | "CUSTOMER";
  action: string;
  entityType: "USER" | "SELLER" | "ORDER" | "PRODUCT";
  entityId: string;
  changes?: Record<string, IAuditChange>;
  createdAt: string;
}
