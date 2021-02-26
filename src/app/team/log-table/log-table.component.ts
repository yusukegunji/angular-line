import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditResultDialogComponent } from 'src/app/dialogs/edit-result-dialog/edit-result-dialog.component';
import { LogWithUser } from 'src/app/interfaces/log';
import { Team } from 'src/app/interfaces/team';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.scss'],
})
export class LogTableComponent implements OnInit, AfterViewInit {
  @Input() team: Team;
  @Input() monthId: string;

  readonly displayedColumns: string[] = [
    'status',
    'photoURL',
    'name',
    'position',
    'logedInAt',
    'tookBreakAt',
    'backedBreakAt',
    'totalBreakTime',
    'logedOutAt',
    'totalTime',
    'overTime',
    // 'location',
    // 'commutingFee',
    'menu',
  ];

  dataSource = new MatTableDataSource<{
    logWithUser: LogWithUser;
    totalWorkTime: any;
    totalBreakTime: any;
    overTime: any;
  }>([]);

  defaultPageSize = 10;
  isLoading: boolean;
  totalTime: any;
  totalWorkTime: any;
  totalBreakTime: any;
  roundTime: any;
  overTime: any;
  breakTime: number;
  plan = 28800000;

  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(private logService: LogService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.logService
      .getDailyLogsWithUser(this.team.teamId, this.monthId)
      .subscribe((logsWithUser) => {
        if (!logsWithUser) {
          return null;
        }
        this.dataSource.data = logsWithUser.map((log: LogWithUser) => {
          const breakIn: any = log.tookBreakAt?.toDate();
          const breakOut: any = log.backedBreakAt?.toDate();
          this.breakTime =
            !log.tookBreakAt || !log.backedBreakAt
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

          const logOut: any = log.logedOutAt?.toDate();
          const logIn: any = log.logedInAt?.toDate();
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
            logWithUser: { ...log },
            totalWorkTime: this.totalWorkTime,
            totalBreakTime: this.totalBreakTime,
            overTime: this.overTime,
          };
        });
      });
  }

  ngAfterViewInit(): void {}

  openEditDialog(log: LogWithUser): void {
    this.dialog.open(EditResultDialogComponent, { data: { log } });
  }
}
