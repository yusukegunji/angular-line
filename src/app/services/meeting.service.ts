import { Injectable } from '@angular/core';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  localPlayer = document.getElementById('local-player');
  agoraAppId: string = environment.agora.appId;
  agoraUid: any;
  localTracks = {
    videoTrack: null,
    audioTrack: null,
  };
  remoteUsers = {};
  globalAgoraClient: IAgoraRTCClient | null = null;
  isProcessing: boolean;
  constructor(
    private fnc: AngularFireFunctions,
    private router: Router,
    private snackBar: MatSnackBar,
    private db: AngularFirestore
  ) {}

  addVideoStream(streamId): void {
    const streamDiv = document.createElement('div');
    streamDiv.id = streamId;
    streamDiv.style.transform = 'rotateY(180deg)';
    this.localPlayer.appendChild(streamDiv);
  }

  removeVideoStream(streamId): void {
    const remDiv = document.getElementById(streamId);
    if (remDiv) {
      remDiv.parentNode.removeChild(remDiv);
    }
  }

  async joinChannel(uid: string, channelName: string): Promise<any> {
    this.isProcessing = true;
    const callable = this.fnc.httpsCallable('participateChannel');
    await callable({ channelName })
      .toPromise()
      .catch((error) => {
        console.log(error);
        this.router.navigate(['/']);
      });
    if (!uid) {
      throw new Error('channel name is required.');
    }
    const token: any = await this.getToken(channelName);

    await this.client.join(this.agoraAppId, channelName, token.token, uid);

    this.snackBar.open('チャンネルに参加しました');
    this.isProcessing = false;

    this.client.on('user-published', async (user, mediaType) => {
      await this.client.subscribe(user, mediaType);
      this.snackBar.open('参加者が増えました');
      const remoreUserId = user.uid;
      if (mediaType === 'video') {
        const playerElement = document.createElement('div');
        document.getElementById('remote-player-list').append(playerElement);
        playerElement.outerHTML = `
          <div id="player-wrapper-${remoreUserId}">
            <p class="player-name">remoteUser(${remoreUserId})</p>
            <div id="player-${remoreUserId}" class="player"></div>
          </div>
        `;

        const remoteTrack = user.videoTrack;
        remoteTrack.play('local-player');
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });

    // this.client.on('user-unpublished', async (user, mediaType) => {
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
    return this.agoraUid;
  }

  async getToken(channelName): Promise<string> {
    const callable = this.fnc.httpsCallable('getChannelToken');
    const agoraToken = await callable({ channelName })
      .toPromise()
      .catch((error) => {
        console.log(channelName);
        console.log(error);
        this.router.navigate(['/']);
      });
    if (agoraToken) {
      return agoraToken;
    }
  }

  async unpublishAgora(): Promise<void> {
    const client = this.getClient();
    if (client.localTracks.length > 0) {
      client.localTracks.forEach((v) => v.close());
      client.unpublish();
    }
  }

  async leaveChannel(uid: string, channelName: string): Promise<void> {
    const client = this.getClient();
    if (!uid || !channelName) {
      console.log('uid and channelName is requird');
      return null;
    }
    if (!this.localTracks) {
      console.log('localTracks are null');
      return null;
    }
    if (this.localTracks) {
      await Promise.all([
        client.unpublish(Object.values(this.localTracks)),
        this.client.leave(),
        this.leaveFromSession(channelName),
        this.router.navigate(['/']),
      ]);
    }
  }

  async leaveFromSession(channelName: string): Promise<void> {
    const callable = this.fnc.httpsCallable('leaveFromSession');
    await callable({ channelName })
      .toPromise()
      .catch((error) => {
        console.log(channelName);
        console.log(error);
        this.router.navigate(['/']);
      });
  }

  async publishMicrophone(): Promise<void> {
    const client = this.getClient();

    this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([this.localTracks.audioTrack]);
  }

  async unpublishMicrophone(): Promise<void> {
    const client = this.getClient();

    if (this.localTracks.audioTrack) {
      this.localTracks.audioTrack.close();
      client.unpublish(this.localTracks.audioTrack);
    }
  }

  async publishVideo(): Promise<void> {
    const client = this.getClient();

    this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    this.snackBar.open('カメラをオンにしました');
    this.localTracks.videoTrack.play('local-player');

    await client.publish([this.localTracks.videoTrack]);
  }

  async unpublishVideo(): Promise<void> {
    const client = this.getClient();

    if (this.localTracks.videoTrack) {
      this.localTracks.videoTrack.close();
      client.unpublish();
    }
  }

  getClient(): IAgoraRTCClient {
    if (!this.globalAgoraClient) {
      const newClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      this.globalAgoraClient = newClient;
    }
    return this.globalAgoraClient;
  }

  getParticipants(channelId: string): Observable<User[]> {
    return this.db
      .collection<User>(`channels/${channelId}/participants`)
      .valueChanges();
  }
}
