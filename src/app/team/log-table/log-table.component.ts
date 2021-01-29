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
    'totalBreakTime',
    'logedOutAt',
    'totalTime',
    'overTime',
    'location',
    'commutingFee',
    'menu',
  ];

  dataSource = new MatTableDataSource<{
    logWithUser: LogWithUser;
    totalHH: any;
    totalMM: any;
    totalBreakTime: any;
    overHH: any;
    overMM: any;
  }>([]);

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
  array: any[];
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
        this.dataSource.data = logsWithUser.map((log: LogWithUser) => {
          const breakIn: any = log.tookBreakAt?.toDate();
          const breakOut: any = log.backedBreakAt?.toDate();
          this.totalBreakTime = this.transformDigit(
            (breakOut - breakIn) / 1000 / 3600,
            2
          );

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
          console.log(this.totalBreakTime);

          return {
            logWithUser: { ...log },
            totalHH: this.totalHH,
            totalMM: this.totalMM,
            totalBreakTime: this.totalBreakTime,
            overHH: this.overHH,
            overMM: this.overMM,
          };
        });
      });
  }

  ngAfterViewInit(): void {}

  transformDigit(num: number, digit: number): number {
    const time = Math.pow(10, digit);
    return Math.floor(num * time) / time;
  }
}
