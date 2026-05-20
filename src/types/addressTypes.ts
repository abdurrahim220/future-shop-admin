export interface IAddress {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  division: string;
  district: string;
  upazilla: string;
  village: string;
  phone: string;
  email: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}
