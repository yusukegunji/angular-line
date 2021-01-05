import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  lineAuthURL: string;

  constructor(private fns: AngularFireFunctions) {}

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

    return (this.lineAuthURL = url.href);
  }

  loginWithLine(): void {
    this.getLineLoginURL();
  }
}
