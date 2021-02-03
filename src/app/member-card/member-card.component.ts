import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LogWithUser } from '../interfaces/log';
import { User, UserWithLogs } from '../interfaces/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent implements OnInit {
  @Input() joinedUid: string;
  @Input() teamId: string;
  @Input() monthId: string;
  user$: Observable<User>;
  userWithLogs: UserWithLogs;

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.getUserData(this.joinedUid);
  }
}
