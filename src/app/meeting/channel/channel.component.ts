import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  user$: Observable<User> = this.authService.user$;
  channelId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('channelId'))
  );
  channelId: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    console.log('channel');
    this.channelId$.subscribe((id) => {
      this.channelId = id;
    });
  }

  async joinChannel(uid: string): Promise<void> {
    const channelName = this.channelId;
    this.meetingService.joinChannel(uid, channelName);
  }

  async leaveChannel(uid: string): Promise<void> {
    this.meetingService.leaveChannel(uid, this.channelId);
  }
}
