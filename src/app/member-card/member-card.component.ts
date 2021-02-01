import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LogWithUser } from '../interfaces/log';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Input() logs: LogWithUser[];
  constructor(public authService: AuthService) {
    console.log(this.logs);
  }

  ngOnInit(): void {}
}
