import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LogWithUser } from 'src/app/interfaces/log';
import { Team } from 'src/app/interfaces/team';
import { LogService } from 'src/app/services/log.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.scss'],
})
export class LogTableComponent implements OnInit, AfterViewInit {
  readonly displayedColumns: string[] = [
    'status',
    'photoURL',
    'name',
    'position',
    'logedInAt',
    'tookBreakAt',
    'backedBreakAt',
    'logedOutAt',
    'totalTime',
    'overTime',
    'location',
    'commutingFee',
    'menu',
  ];

  dataSource: MatTableDataSource<{
    logWithUser: LogWithUser;
    totalHH: any;
    totalMM: any;
    overHH: any;
    overMM: any;
  }>;
  defaultPageSize = 10;
  isLoading: boolean;
  teamId: string;
  totalTime: any;
  totalBreakTime: any;
  roundTime: any;
  totalHH: any;
  totalMM: any;
  overTime: any;
  plan = 28800000;
  overHH: any;
  overMM: any;

  team$: Observable<Team> = this.route.paramMap.pipe(
    switchMap((param) => {
      const teamId = param.get('id');
      return this.teamService.getTeam(teamId);
    })
  );

  @Input() team: Team;

  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    private teamService: TeamService,
    private logService: LogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.logService
      .getDailyLogsWithUser(this.team.teamId, 'AECxI0VA3ko21z19THh3')
      .subscribe((logsWithUser) => {
        logsWithUser.map((log: LogWithUser) => {
          const breakIn: any = log.tookBreakAt?.toDate();
          const breakOut: any = log.backedBreakAt?.toDate();
          this.totalBreakTime = Math.abs(breakOut - breakIn);

          const logOut: any = log.logedOutAt?.toDate();
          const logIn: any = log.logedInAt?.toDate();
          this.totalTime = Math.abs(logOut - logIn - this.totalBreakTime);

          this.roundTime = Math.round(this.totalTime / 1000);
          this.totalHH = Math.floor(this.roundTime / 3600);
          this.totalMM = Math.floor(
            (this.roundTime - this.totalHH * 3600) / 60
          );

          this.overTime = Math.round((this.totalTime - this.plan) / 1000);
          this.overHH = Math.floor(this.overTime / 3600);
          this.overMM = Math.floor((this.overTime - this.overHH * 3600) / 60);
          console.log(...logsWithUser);
          console.log(this.totalHH);
          console.log(this.overHH);

          this.dataSource = new MatTableDataSource([
            {
              logWithUser: log,
              totalHH: this.totalHH,
              totalMM: this.totalMM,
              overHH: this.overHH,
              overMM: this.overMM,
            },
          ]);
          this.dataSource.paginator = this.paginator;
        });

        // this.totalBreakTime = logsWithUser.map((elm) => {
        //   Object.keys(elm).map((key) => {
        //     console.log(elm.tookBreakAt.toDate());

        //     const breakIn: any = elm.tookBreakAt?.toDate();
        //     const breakOut: any = elm.backedBreakAt?.toDate();
        //     return Math.abs(breakOut - breakIn);
        //   });
        // });

        // this.totalTime = logsWithUser.map((elm) => {
        //   Object.keys(elm).map((key) => {
        //     const logOut: any = elm.logedOutAt?.toDate();
        //     const logIn: any = elm.logedInAt?.toDate();

        //     return Math.abs(logOut - logIn - this.totalBreakTime);
        //   });
        // });
      });
  }

  ngAfterViewInit(): void {}
}
