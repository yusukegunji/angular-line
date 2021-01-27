import { User } from './user';

export interface Log {
  name: string;
  position?: string;
  isWorking: boolean;
  logedInAt?: firebase.default.firestore.Timestamp;
  tookBreakAt?: firebase.default.firestore.Timestamp;
  backedBreakAt?: firebase.default.firestore.Timestamp;
  logedOutAt?: firebase.default.firestore.Timestamp;
  location?: firebase.default.firestore.GeoPoint;
  commutingFee?: number;
  userId: string;
  teamId: string;
  logId: string;
}

export interface LogWithUser extends Log {
  user: User;
}
