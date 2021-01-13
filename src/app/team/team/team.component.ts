import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JoinedUid } from 'functions/interfaces/joined-uid';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DeleteDialogComponent } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { Team } from 'src/app/interfaces/team';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  // uids: string[];
  isLoading: boolean;

  user$: Observable<User> = this.authService.user$;

  teamId$: Observable<string> = this.route.paramMap.pipe(
    map((param) => {
      return param.get('id');
    })
  );

  team$: Observable<Team> = this.teamId$.pipe(
    switchMap((id) => {
      return this.teamService.getTeam(id);
    })
  );

  // joinedUids$: Observable<JoinedUid[]> = this.route.paramMap.pipe(
  //   switchMap((param) => {
  //     const teamId = param.get('id');
  //     return this.userService.getJoinedUids(teamId);
  //   })
  // );

  joinedUsers$: Observable<User[]> = this.route.paramMap.pipe(
    switchMap((param) => {
      const teamId = param.get('id');
      return this.userService.getjoinedUsers(teamId).pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
    })
  );

  constructor(
    public teamService: TeamService,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    // this.joinedUids$.subscribe((params) => {
    //   this.joinedUsers$ = params.map((param) => {
    //     return this.userService.getUserData(param.uid);
    //   });
    // });
  }

  ngOnInit(): void {
    this.isLoading = true;
  }

  openDeleteDialog(team: Team): void {
    this.dialog
      .open(DeleteDialogComponent, {
        width: '400px',
        autoFocus: false,
        data: { team },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.teamService.deleteTeam(team.teamId);
        } else {
          return;
        }
      });
  }
}
