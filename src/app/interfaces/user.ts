import { Log } from './log';

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  isAdmin?: boolean;
  position?: string;
  result?: number;
  plan?: number;
  createdAt: firebase.default.firestore.Timestamp;
  isWorking: boolean;
  activeTeamId: string;
}

export interface UserWithLogs extends User {
  logs: Log[];
}
