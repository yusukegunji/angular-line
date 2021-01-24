import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JoinedUid } from 'functions/interfaces/joined-uid';
import { StickerMessage } from 'functions/node_modules/messaging-api-line/dist/LineTypes';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isProcessing: boolean;

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private fnc: AngularFireFunctions,
    private snackBar: MatSnackBar
  ) {}

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

  async updateUser(
    user: Omit<
      User,
      'createdAt' | 'email' | 'isWorking' | 'isAdmin' | 'result' | 'plan'
    >
  ): Promise<void> {
    await this.db.doc<User>(`users/${user.uid}`).update({
      ...user,
    });
    this.router.navigate(['/']);
  }

  async deleteUser(uid: string): Promise<void> {
    this.isProcessing = true;
    const callable = this.fnc.httpsCallable('deleteAfUser');
    return callable(uid)
      .toPromise()
      .then(() => {
        this.snackBar.open('ご利用ありがとうございました');
        this.router.navigateByUrl('/welcome');
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }
}
