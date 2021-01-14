export interface Log {
  status: string;
  name: string;
  position: string;
  logedInAt: firebase.default.firestore.Timestamp;
  tookBreakAt: firebase.default.firestore.Timestamp;
  backedBreakAt: firebase.default.firestore.Timestamp;
  logedOutAt: firebase.default.firestore.Timestamp;
  location: string;
  commutingFee: number;
}
