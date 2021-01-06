import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
    const callable = this.fns.httpsCallable('getCustomToken');
    const customToken = await callable({ code })
      .toPromise()
      .catch((error) => {
        console.log(error);
        console.log(code);

        this.router.navigate(['/']);
      });

    if (customToken) {
      console.log(customToken);

      this.afAuth
        .signInWithCustomToken(customToken)
        .then(() => {
          this.snackbar.open('ログインしました');
          this.router.navigate(['/']);
        })
        .catch((error) => {
          console.log('failed to sign in');
          console.error(error);
        });
    }
  }

  logout(): void {
    this.afAuth.signOut();
    this.router.navigate(['/'], {
      queryParams: null,
    });
  }
}
