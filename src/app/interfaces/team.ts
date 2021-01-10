export interface Team {
  teamId: string;
  name: string;
  thumbnailUTL?: string;
  createdAt: firebase.default.firestore.Timestamp;
  updatedAt: firebase.default.firestore.Timestamp;
  ownerId: string;
  memberIds?: string[];
}
