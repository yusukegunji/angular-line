import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { fade } from '../animation';
import { Log } from '../interfaces/log';
import { User, UserWithLogs } from '../interfaces/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
  animations: [fade],
})
export class MemberCardComponent implements OnInit {
  @Input() joinedUid: string;
  @Input() teamId: string;
  @Input() monthId: string;
  user$: Observable<User>;
  user: User;
  userWithLogs: UserWithLogs;
  logs: Log[];
  breakTime: any;
  workTime: any;
  overTime: any;
  dailytotalWorkTime: any;
  dailyWorkTimes = [];
  monthlyTotalWorkTime = 0;

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.getUserData(this.joinedUid);
    this.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService
      .getMonthlyLogsByUid(this.teamId, this.monthId, this.joinedUid)
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
          this.dailyWorkTimes.push(this.dailytotalWorkTime);
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
