import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Log } from 'src/app/interfaces/log';
import { Team } from 'src/app/interfaces/team';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.scss'],
})
export class LogTableComponent implements OnInit, AfterViewInit {
  readonly displayedColumns: string[] = [
    'status',
    'name',
    'position',
    'logedInAt',
    'tookBreakAt',
    'backedBreakAt',
    'logedOutAt',
    'location',
    'commutingFee',
    'menu',
  ];

  dataSource = [
    {
      status: 'string',
      name: 'string',
      position: 'string',
      logedInAt: { seconds: 1610393765, nanoseconds: 75000000 },
      tookBreakAt: { seconds: 1610393765, nanoseconds: 75000000 },
      backedBreakAt: { seconds: 1610393765, nanoseconds: 75000000 },
      logedOutAt: { seconds: 1610393765, nanoseconds: 75000000 },
      location: 'string',
      commutingFee: 1000,
    },
  ];

  defaultPageSize = 10;

  @Input() team: Team;

  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
