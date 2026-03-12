export const userRole = {
  admin: "admin",
  seller: "seller",
  customer: "customer",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];
