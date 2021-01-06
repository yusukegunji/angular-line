import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  lineAuthURL: string;

  constructor(
    private fns: AngularFireFunctions,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
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
        this.authService.loginWithLine(code);
      }
    });

    this.getLineLoginURL().then((url) => {
      this.lineAuthURL = url;
    });
  }

  ngOnInit(): void {}

  private async getLineLoginURL(): Promise<string> {
    const callable = this.fns.httpsCallable('createState');
    const state = await callable({}).toPromise();
    const url = new URL('https://access.line.me/oauth2/v2.1/authorize');

    url.search = new URLSearchParams({
      response_type: 'code',
      client_id: environment.line.clientId,
      state,
      scope: 'profile openid email',
      bot_prompt: 'aggressive',
      redirect_uri: environment.line.redirectURI,
    }).toString();

    return url.href;
  }
}
