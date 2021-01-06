import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fns: AngularFireFunctions,
    private afAuth: AngularFireAuth,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  async loginWithLine(code: string): Promise<void> {
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
