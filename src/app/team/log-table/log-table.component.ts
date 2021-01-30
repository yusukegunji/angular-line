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
    totalWorkTime: any;
    totalBreakTime: any;
    overTime: any;
  }>([]);

  defaultPageSize = 10;
  isLoading: boolean;
  teamId: string;
  totalTime: any;
  totalWorkTime: any;
  totalBreakTime: any;
  roundTime: any;
  overTime: any;
  plan = 28800000;
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
          const breakTime = 1000 * Math.round((breakOut - breakIn) / 1000);
          const bt = new Date(breakTime);
          this.totalBreakTime = bt.getUTCHours() + ':' + bt.getUTCMinutes();

          const logOut: any = log.logedOutAt?.toDate();
          const logIn: any = log.logedInAt?.toDate();
          const workTime =
            1000 * Math.round((logOut - logIn - breakTime) / 1000);
          const wt = new Date(workTime);
          this.totalWorkTime = wt.getUTCHours() + ':' + wt.getUTCMinutes();

          const resultTime = workTime - breakTime - this.plan;
          const rt = new Date(resultTime);
          this.overTime =
            resultTime > 0 ? rt.getUTCHours() + ':' + rt.getUTCMinutes() : 0;

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
}
