import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  user$: Observable<User> = this.authService.user$;
  channelId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('channelId'))
  );
  channelId: string;
  players: any;
  isProcessing: boolean;

  participants$: Observable<User[]> = this.channelId$.pipe(
    switchMap((params) => {
      this.channelId = params;
      return this.meetingService.getParticipants(this.channelId);
    })
  );

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public meetingService: MeetingService
  ) {
    // this.client.on('user-published', async (user, mediaType) => {
    //   await this.client.subscribe(user, mediaType);
    //   this.snackBar.open('参加者が増えました');
    //   const remoreUserId = user.uid;
    //   if (mediaType === 'video') {
    //     const playerElement = document.createElement('div');
    //     document.getElementById('remote-player-list').append(playerElement);
    //     playerElement.outerHTML = `
    //       <div id="player-wrapper-${remoreUserId}">
    //         <p class="player-name">remoteUser(${remoreUserId})</p>
    //         <div id="player-${remoreUserId}" class="player"></div>
    //       </div>
    //     `;
    //     const remoteTrack = user.videoTrack;
    //     remoteTrack.play('local-player');
    //   }
    //   if (mediaType === 'audio') {
    //     user.audioTrack.play();
    //   }
    // });
  }

  ngOnInit(): void {
    this.channelId$.subscribe((id) => {
      this.channelId = id;
    });
  }

  async joinChannel(uid: string): Promise<void> {
    const channelName = this.channelId;
    this.meetingService.joinChannel(uid, channelName);
    this.players = true;
  }

  async leaveChannel(uid: string): Promise<void> {
    this.meetingService.leaveChannel(uid, this.channelId);
    this.players = false;
  }
}
