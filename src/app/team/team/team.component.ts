import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DeleteDialogComponent } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { Team } from 'src/app/interfaces/team';
import { User, UserWithLogs } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LogService } from 'src/app/services/log.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  isLoading: boolean;
  date = firebase.default.firestore.Timestamp.now();
  years = [2021];
  months = [...new Array(12)].map((_, i) => i + 1);
  selectedValue: number;

  yearControl = new FormControl('');
  monthControl = new FormControl('');
  selectedYear: string;
  teamId: string;
  monthId: string;
  uid: string;
  joinedUsersWithLogs$: Observable<UserWithLogs[]>;

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

  selectedMonth$: Observable<string> = this.route.firstChild.paramMap.pipe(
    map((param) => {
      return param.get('monthId');
    })
  );

  monthId$: Observable<string> = this.route.firstChild.paramMap.pipe(
    map((params) => {
      return params.get('monthId');
    })
  );

  constructor(
    public teamService: TeamService,
    private userService: UserService,
    private logService: LogService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
    const date = new Date();
    const yyyyMM =
      `${date.getFullYear()}` +
      `${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }`;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.teamId$.subscribe((id) => {
      this.teamId = id;
    });
    this.monthId$.subscribe((id) => {
      this.monthId = id;
    });
    this.user$.subscribe((user) => {
      this.uid = user.uid;
      console.log(user);
    });
  }

  setYear(value: string): void {
    if (value) {
      this.selectedYear = value;
    }
  }

  navigateTo(value: number): void {
    if (value) {
      if (value < 10) {
        this.router.navigateByUrl(
          `/team/${this.teamId}/${this.selectedYear}0${value}`
        );
      } else {
        this.router.navigateByUrl(
          `/team/${this.teamId}/${this.selectedYear}${value}`
        );
      }
    }
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
