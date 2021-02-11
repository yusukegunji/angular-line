import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { indicatorRotate } from '../animation';
import { Team } from '../interfaces/team';
import { JoinTeamDialogComponent } from '../join-team-dialog/join-team-dialog.component';
import { AuthService } from '../services/auth.service';
import { TeamService } from '../services/team.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  animations: [indicatorRotate],
})
export class MainNavComponent implements OnInit {
  uid: string;

  myTeams$: Observable<Team[]> = this.authService.user$.pipe(
    switchMap((user) => {
      this.uid = user.uid;
      return this.teamService.getSelfOwningTeams(this.uid);
    })
  );

  joinedTeams$: Observable<Team[]> = this.authService.user$.pipe(
    switchMap((user) => {
      this.uid = user.uid;
      return this.teamService.getJoinedTeams(this.uid);
    })
  );

  ownerTeamExpands: boolean[] = [];
  joinedTeamExpands: boolean[] = [];

  constructor(
    public uiService: UiService,
    public authService: AuthService,
    private teamService: TeamService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.myTeams$.subscribe((teams) => {
      teams.forEach(() => {
        this.ownerTeamExpands.push(false);
      });
    });

    this.joinedTeams$.subscribe((teams) => {
      teams.forEach(() => {
        this.joinedTeamExpands.push(false);
      });
    });
  }

  openJoinTeamDialog(uid: string): void {
    this.dialog.open(JoinTeamDialogComponent, {
      maxWidth: '100vw',
      minWidth: '50%',
      autoFocus: false,
      restoreFocus: false,
      data: { uid },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleNav(): void {
    this.uiService.isOpened = !this.uiService.isOpened;
  }
}
