export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  isAdmin?: boolean;
  post?: string;
  result?: number;
  plan?: number;
  createdAt: firebase.default.firestore.Timestamp;
  isWorking: boolean;
}
