import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-line-auth-handler',
  templateUrl: './line-auth-handler.component.html',
  styleUrls: ['./line-auth-handler.component.scss'],
})
export class LineAuthHandlerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private fns: AngularFireFunctions,
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((param: Params) => {
      const key = 'error';
      const description = 'error_description';
      const error = param[key];
      const errorDescription = param[description];

      if (error) {
        console.error(errorDescription);
        this.router.navigate(['/']);
        return;
      }

      const code = param.get('code');
      if (code) {
        this.loginWithLine(code);
      }
    });
  }

  async loginWithLine(code: string): Promise<void> {
    const callable = this.fns.httpsCallable('getCustomToken');
    const customToken = await callable({}).toPromise();

    this.afAuth
      .signInWithCustomToken(customToken)
      .then(() => {
        this.snackbar.open('ログインに成功しました');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.log('failed to sign in');
        console.error(error);
      });
  }
}
