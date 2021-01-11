import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Team } from 'src/app/interfaces/team';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  uid: string;

  myTeams$: Observable<Team[]>;

  constructor(
    private afAuth: AngularFireAuth,
    public authService: AuthService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      this.uid = user.uid;
      this.myTeams$ = this.teamService.getSelfOwningTeams(this.uid);
    });
  }

  logout(): void {
    this.afAuth.signOut();
  }
}
