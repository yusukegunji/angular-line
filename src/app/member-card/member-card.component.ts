import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LogWithUser } from '../interfaces/log';
import { User, UserWithLogs } from '../interfaces/user';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent implements OnInit {
  @Input() joinedUid: string;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    console.log(this.joinedUid);
  }
}
