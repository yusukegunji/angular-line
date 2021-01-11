import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
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

  constructor(
    private afAuth: AngularFireAuth,
    public authService: AuthService,
    private teamService: TeamService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      this.uid = user.uid;
      this.myTeams$ = this.teamService.getSelfOwningTeams(this.uid);
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
    this.afAuth.signOut();
  }
}
