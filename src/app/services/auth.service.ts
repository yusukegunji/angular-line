import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isProcessing: boolean;
  user: any;
  user$: Observable<User> = this.afAuth.user.pipe(
    switchMap((user) => {
      this.user = user;
      if (user) {
        return this.db.doc(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  constructor(
    private fns: AngularFireFunctions,
    private afAuth: AngularFireAuth,
    private snackbar: MatSnackBar,
    private router: Router,
    private db: AngularFirestore
  ) {}

  async loginWithLine(code: string): Promise<void> {
    this.isProcessing = true;
    const callable = this.fns.httpsCallable('getCustomToken');
    const customToken = await callable({ code })
      .toPromise()
      .catch((error) => {
        console.log(error);
        this.router.navigate(['/']);
      });

    if (customToken) {
      this.afAuth
        .signInWithCustomToken(customToken)
        .then(() => {
          this.snackbar.open('ログインしました');
          this.router.navigate(['/']);
        })
        .catch((error) => {
          console.log('failed to sign in');
          console.error(error);
        })
        .finally(() => (this.isProcessing = false));
    }
  }

  async googleLogin(): Promise<void> {
    this.isProcessing = true;
    const provider = new firebase.default.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    this.afAuth
      .signInWithPopup(provider)
      .then(() => {
        this.snackbar.open('ログインしました');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.log('failed to sign in');
        console.error(error);
      })
      .finally(() => (this.isProcessing = false));
  }

  logout(): void {
    this.afAuth.signOut();
    this.router
      .navigate(['/welcome'], {
        queryParams: null,
      })
      .then(() => this.snackbar.open('ログアウトしました'));
  }
}
