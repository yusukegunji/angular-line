export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  creanCount?: number;
  isAdmin?: boolean;
  post?: string;
}
