import { Component, OnInit } from '@angular/core';
import { StickerMessage } from 'messaging-api-line/dist/LineTypes';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Team } from '../interfaces/team';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { TeamService } from '../services/team.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-mini-nav',
  templateUrl: './mini-nav.component.html',
  styleUrls: ['./mini-nav.component.scss'],
})
export class MiniNavComponent implements OnInit {
  uid: string;
  user$: Observable<User> = this.authService.user$;
  activeTeam$: Observable<Team>;

  date: Date = new Date();
  thisMonth: string =
    `${this.date.getFullYear()}` +
    `${
      this.date.getMonth() + 1 < 10
        ? '0' + (this.date.getMonth() + 1)
        : this.date.getMonth() + 1
    }`;

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.user$.pipe(take(1)).subscribe((user) => {
      this.activeTeam$ = this.teamService.getTeam(user.activeTeamId);
    });
  }

  toggleNav(): void {
    this.uiService.isOpened = !this.uiService.isOpened;
  }
}
