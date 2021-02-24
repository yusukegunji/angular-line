import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { QrDialogComponent } from 'src/app/dialogs/qr-dialog/qr-dialog.component';
import { Team } from 'src/app/interfaces/team';
import { JoinTeamDialogComponent } from 'src/app/join-team-dialog/join-team-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  uid: string;

  myTeams$: Observable<Team[]>;
  joinedTeams$: Observable<Team[]>;
  activeTeamName$: Observable<string>;

  date: Date = new Date();
  thisMonth: string =
    `${this.date.getFullYear()}` +
    `${
      this.date.getMonth() + 1 < 10
        ? '0' + (this.date.getMonth() + 1)
        : this.date.getMonth() + 1
    }`;

  constructor(
    private afAuth: AngularFireAuth,
    public authService: AuthService,
    private teamService: TeamService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      this.uid = user?.uid;
      this.myTeams$ = this.teamService.getSelfOwningTeams(this.uid);
      this.joinedTeams$ = this.teamService.getJoinedTeams(this.uid);
      this.activeTeamName$ = this.teamService.getTeam(user?.activeTeamId).pipe(
        map((team) => {
          return team?.name;
        })
      );
    });
    this.dialog.open(QrDialogComponent);
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
    this.afAuth.signOut();
  }
}
