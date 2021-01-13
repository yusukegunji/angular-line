import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Firestore } from '@google-cloud/firestore';
import { JoinedUid } from 'functions/interfaces/joined-uid';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';

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

  getUserData(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  // getJoinedUids(teamId: string): Observable<JoinedUid[]> {
  //   return this.db
  //     .collection<JoinedUid>(`teams/${teamId}/joinedUids`)
  //     .valueChanges();
  // }

  getjoinedUsers(teamId: string): Observable<User[]> {
    return this.db
      .collectionGroup<JoinedUid>('joinedUids', (ref) =>
        ref.where('teamId', '==', teamId)
      )
      .valueChanges()
      .pipe(
        switchMap((joinedUids) => {
          if (joinedUids.length) {
            return combineLatest(
              joinedUids.map((joinedUid) => this.getUserData(joinedUid.uid))
            );
          } else {
            return of(null);
          }
        })
      );
  }
}
