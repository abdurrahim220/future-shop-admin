import type { UserRole } from "./userRoleTyps";

export type IUser = {
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordChangedAt?: Date;
  status?: "active" | "blocked";
  isVerified?: boolean;
  otp?: number;
  otpExpires?: Date;
  gender?: "male" | "female" | "other";
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  isDeleted?: boolean;
  sellerRequest?: "pending" | "approved" | "rejected" | "not_requested";
};