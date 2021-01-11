import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Team } from 'src/app/interfaces/team';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  user$: Observable<User> = this.authService.user$;
  teamId$: Observable<string> = this.route.paramMap.pipe(
    map((param) => {
      return param.get('id');
    })
  );

  team$: Observable<Team> = this.teamId$.pipe(
    switchMap((id) => {
      return this.teamService.getTeam(id);
    })
  );

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  openDeleteDialog(): void {}
}
