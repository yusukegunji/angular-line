import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Log } from 'src/app/interfaces/log';
import { User, UserWithLogs } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  userWithLogs: UserWithLogs;
  logs: Log[];
  breakTime: any;
  workTime: any;
  overTime: any;
  dailytotalWorkTime: any;
  dailyWorkTimes = [];
  monthlyTotalWorkTime = 0;
  monthlyPlanWorkTime = 0;
  memberId: string;
  teamId: string;
  monthId: string;

  member$: Observable<User> = this.route.paramMap.pipe(
    switchMap((params) => {
      this.memberId = params.get('uid');
      return this.userService.getUserData(this.memberId);
    })
  );

  teamId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => {
      return params.get('teamId');
    })
  );

  monthId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => {
      return params.get('monthId');
    })
  );

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.monthId$.subscribe((id) => {
      this.monthId = id;
    });

    this.teamId$.subscribe((id) => {
      this.teamId = id;
    });

    this.member$.subscribe((member) => {
      this.memberId = member?.uid;
    });

    this.userService
      .getMonthlyLogsByUid(this.teamId, this.monthId, this.memberId)
      .subscribe((logs) => {
        logs.map((log: Log) => {
          const breakIn: any = log.tookBreakAt?.toDate();
          const breakOut: any = log.backedBreakAt?.toDate();
          this.breakTime =
            !log.tookBreakAt || !log.backedBreakAt
              ? 0
              : 1000 * Math.round((breakOut - breakIn) / 1000);

          const logOut: any = log.logedOutAt?.toDate();
          const logIn: any = log.logedInAt?.toDate();
          this.workTime =
            1000 * Math.round((logOut - logIn - this.breakTime) / 1000);
          this.dailytotalWorkTime =
            Math.round((this.workTime * 10) / (1000 * 60 * 60)) / 10;

          if (!this.dailytotalWorkTime) {
            this.dailyWorkTimes.push(0);
          } else {
            this.dailyWorkTimes.push(this.dailytotalWorkTime);
          }
          this.monthlyTotalWorkTime =
            Math.round(
              this.dailyWorkTimes.reduce((a, b) => {
                return a + b;
              }) * 10
            ) / 10;
        });
      });
  }
}
