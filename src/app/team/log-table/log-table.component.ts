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
import { StickerMessage } from 'functions/node_modules/messaging-api-line/dist/LineTypes';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Log, LogWithUser } from 'src/app/interfaces/log';
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
    'sum',
    'location',
    'commutingFee',
    'menu',
  ];

  dataSource: MatTableDataSource<LogWithUser>;
  defaultPageSize = 10;
  isLoading: boolean;
  teamId: string;

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
      });
    });
  }

  ngAfterViewInit(): void {}
}
