export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  creanCount?: number;
  isAdmin?: boolean;
  post?: string;
  result?: number;
  plan?: number;
  createdAt: firebase.default.firestore.Timestamp;
}
