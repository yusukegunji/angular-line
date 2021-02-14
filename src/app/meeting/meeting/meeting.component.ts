import { Attribute, Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormControl, Validators } from '@angular/forms';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit {
  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  agoraAppId: string = environment.agora.appId;
  token: string = environment.agora.token;
  agoraUid: any;
  localTracks = {
    videoTrack: null,
    audioTrack: null,
  };
  remoteUsers = {};
  isProcessing: boolean;

  channelControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(30),
  ]);

  user$: Observable<User> = this.authService.user$;

  constructor(
    private authService: AuthService,
    public meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    console.log(`Your agora.io appId is ${this.agoraAppId}`);
  }

  async joinChannel(uid: string): Promise<void> {
    const channelName = this.channelControl.value;
    const users = this.meetingService.agoraUid;
    this.meetingService.joinChannel(uid, channelName);
  }

  async leaveChannel(): Promise<void> {
    console.log(this.agoraUid);

    // const client = this.meetingService.getToken(this.channelControl.value);
    // this.meetingService.leaveChannel(client);
  }
}
