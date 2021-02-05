import { User } from './user';

export interface Log {
  uid: string;
  activeTeamId: string;
  logedInAt?: firebase.default.firestore.Timestamp;
  tookBreakAt?: firebase.default.firestore.Timestamp;
  backedBreakAt?: firebase.default.firestore.Timestamp;
  logedOutAt?: firebase.default.firestore.Timestamp;
  location?: firebase.default.firestore.GeoPoint;
  commutingFee?: number;
  teamId: string;
  dayId: string;
  monthId: string;
}

export interface LogWithUser extends Log {
  user: User;
}
