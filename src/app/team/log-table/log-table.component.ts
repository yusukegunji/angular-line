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
import { threadId } from 'worker_threads';

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

  dataSource: MatTableDataSource<LogWithUser>;
  defaultPageSize = 10;
  isLoading: boolean;
  teamId: string;
  totalTime: any;
  totalBreakTime: any;
  time: any;
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
    this.team$.subscribe((team) => {
      this.teamId = team.teamId;
      this.logService.getLogsWithUser(this.teamId).subscribe((data) => {
        this.dataSource = new MatTableDataSource<LogWithUser>(data);
        this.totalBreakTime = data.map((logWithUser) => {
          const breakIn: any = logWithUser.tookBreakAt.toDate();
          const breakOut: any = logWithUser.backedBreakAt.toDate();
          return Math.abs(breakOut - breakIn);
        });
        this.totalTime = data.map((logWithUser) => {
          const logOut: any = logWithUser.logedOutAt.toDate();
          const logIn: any = logWithUser.logedInAt.toDate();
          return Math.abs(logOut - logIn - this.totalBreakTime);
        });

        this.time = Math.round(this.totalTime / 1000);
        this.totalHH = Math.floor(this.time / 3600);
        this.totalMM = Math.floor((this.time - this.totalHH * 3600) / 60);

        this.overTime = Math.round((this.totalTime - this.plan) / 1000);
        this.overHH = Math.floor(this.overTime / 3600);
        this.overMM = Math.floor((this.overTime - this.overHH * 3600) / 60);
      });
    });
  }

  ngAfterViewInit(): void {}
}
