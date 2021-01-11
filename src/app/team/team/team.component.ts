import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DeleteDialogComponent } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { Team } from 'src/app/interfaces/team';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
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

  constructor(
    public teamService: TeamService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

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
