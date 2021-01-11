export interface Team {
  teamId: string;
  name: string;
  thumbnailURL?: string;
  description: string;
  createdAt: firebase.default.firestore.Timestamp;
  updatedAt: firebase.default.firestore.Timestamp;
  ownerId: string;
  memberCount?: number;
}
