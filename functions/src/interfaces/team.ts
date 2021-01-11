import firebase from 'firebase/app';

export interface Team {
  teamId: string;
  name: string;
  thumbnailURL?: string;
  description: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  ownerId: string;
  memberIds?: string[];
}
