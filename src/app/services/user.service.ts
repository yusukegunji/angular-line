import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  joinTeam(teamId: string, uid: string): void {
    this.db.doc(`teams/${teamId}/joinedUids/${uid}`).set({
      teamId,
      uid,
    });
    this.db.doc(`users/${uid}/joinedTeams/${teamId}`).set({ teamId });
  }
}
