export interface Day {
  activeTeamId: string;
  tookBreakAt: firebase.default.firestore.Timestamp;
  backedBreakAt?: firebase.default.firestore.Timestamp;
  isWorking: boolean;
  logedInAt?: firebase.default.firestore.Timestamp;
  logedOutAt?: firebase.default.firestore.Timestamp;
  updatedAt?: firebase.default.firestore.Timestamp;
  uid: string;
  monthId: string;
  dayId: string;
  teamId: string;
}
