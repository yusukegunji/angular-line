import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Log, LogWithTeam, LogWithUser } from 'src/app/interfaces/log';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-log-table',
  templateUrl: './user-log-table.component.html',
  styleUrls: ['./user-log-table.component.scss'],
})
export class UserLogTableComponent implements OnInit {
  @Input() user: User;
  dataSource = new MatTableDataSource<{
    log: LogWithTeam;
    totalWorkTime: any;
    totalBreakTime: any;
    overTime: any;
  }>([]);

  readonly displayedColumns: string[] = [
    'days',
    'photoURL',
    'name',
    'logedInAt',
    'tookBreakAt',
    'backedBreakAt',
    'totalBreakTime',
    'logedOutAt',
    'totalTime',
    'overTime',
    'menu',
  ];

  defaultPageSize = 10;
  isLoading: boolean;
  totalTime: any;
  totalWorkTime: any;
  totalBreakTime: any;
  roundTime: any;
  overTime: any;
  breakTime: number;
  plan = 28800000;
  date = new Date();
  monthId =
    `${this.date.getFullYear()}` +
    `${
      this.date.getMonth() + 1 < 10
        ? '0' + (this.date.getMonth() + 1)
        : this.date.getMonth() + 1
    }`;

  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(private userService: UserService) {}

  backMonthId(): void {}
  addMounthId(): void {}

  ngOnInit(): void {
    const teamId = this.user.activeTeamId;
    this.userService
      .getMonthlyLogsWithTeamByUid(teamId, this.monthId, this.user.uid)
      .subscribe((logs) => {
        this.dataSource.data = logs.map((logWithTeam: LogWithTeam) => {
          const breakIn: any = logWithTeam.tookBreakAt?.toDate();
          const breakOut: any = logWithTeam.backedBreakAt?.toDate();
          this.breakTime =
            !logWithTeam.tookBreakAt || !logWithTeam.backedBreakAt
              ? 0
              : 1000 * Math.round((breakOut - breakIn) / 1000);
          const bt = new Date(this.breakTime);
          this.totalBreakTime =
            (bt.getUTCHours() < 10
              ? '0' + bt.getUTCHours()
              : bt.getUTCHours()) +
            ':' +
            (bt.getUTCMinutes() < 10
              ? '0' + bt.getUTCMinutes()
              : bt.getUTCMinutes());

          const logOut: any = logWithTeam.logedOutAt?.toDate();
          const logIn: any = logWithTeam.logedInAt?.toDate();
          const workTime =
            1000 * Math.round((logOut - logIn - this.breakTime) / 1000);
          const wt = new Date(workTime);
          this.totalWorkTime =
            (wt.getUTCHours() < 10
              ? '0' + wt.getUTCHours()
              : wt.getUTCHours()) +
            ':' +
            (wt.getUTCMinutes() < 10
              ? '0' + wt.getUTCMinutes()
              : wt.getUTCMinutes());

          const resultTime = workTime - this.breakTime - this.plan;
          const rt = new Date(resultTime);
          this.overTime =
            resultTime > 0
              ? rt.getUTCHours() +
                ':' +
                (rt.getUTCMinutes() < 10
                  ? '0' + rt.getUTCMinutes()
                  : rt.getUTCMinutes())
              : 0;

          return {
            log: { ...logWithTeam },
            totalWorkTime: this.totalWorkTime,
            totalBreakTime: this.totalBreakTime,
            overTime: this.overTime,
          };
        });
      });
  }
}
