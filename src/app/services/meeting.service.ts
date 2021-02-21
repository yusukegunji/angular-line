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
  async getAgoraUid(uid: string, channelName: string): Promise<any> {
    const token: any = await this.getToken(channelName);
    console.log(token);
    return ([
      this.agoraUid,
      this.localTracks.audioTrack,
      this.localTracks.videoTrack,
    ] = await Promise.all([
      this.client.join(this.agoraAppId, channelName, token.token, uid),
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
      // AgoraRTC.createScreenVideoTrack()
    ]));
  }
  async joinChannel(uid: string, channelName: string): Promise<any> {
    const callable = this.fnc.httpsCallable('participateChannel');
    await callable({ channelName })
      .toPromise()
      .catch((error) => {
        console.log(channelName);
        console.log(error);
        this.router.navigate(['/']);
      });
    if (!uid) {
      throw new Error('channel name is required.');
    }
    const token: any = await this.getToken(channelName);
    console.log(token);
    [
      this.agoraUid,
      this.localTracks.audioTrack,
      this.localTracks.videoTrack,
    ] = await Promise.all([
      this.client.join(this.agoraAppId, channelName, token.token, uid),
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
      // AgoraRTC.createScreenVideoTrack()
    ]);
    this.snackBar.open('ルームにジョインしました');
    this.localTracks.videoTrack.play('local-player');
    this.client.on('user-published', async (user, mediaType) => {
      // Subscribe to a remote user.
      await this.client.subscribe(user, mediaType);
      console.log('subscribe success');
      const remoreUserId = user.uid;
      console.log(remoreUserId);
      console.log(user);
      await this.client.subscribe(user, mediaType);
      console.log('subscribe success');
      if (mediaType === 'video') {
        console.log(mediaType);
        const playerElement = document.createElement('div');
        console.log(playerElement);
        document.getElementById('remote-player-list').append(playerElement);
        playerElement.outerHTML = `
          <div id="player-wrapper-${remoreUserId}">
            <p class="player-name">remoteUser(${remoreUserId})</p>
            <div id="player-${remoreUserId}" class="player"></div>
          </div>
        `;
        console.log(playerElement.outerHTML);
        const remoteTrack = user.videoTrack;
        remoteTrack.play('local-player');
      }
      if (mediaType === 'audio') {
        console.log(user);
        console.log(mediaType);
        user.audioTrack.play();
      }
    });
    // this.client.on('user-unpublished', this.handleUserUnpublished);
    await this.client.publish(Object.values(this.localTracks));
    console.log('publish success');
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

  async handleUserPublished(user, mediaType): Promise<void> {
    const id = user.uid;
    console.log(id);
    this.remoteUsers[id] = user;
    console.log(this.remoteUsers[id]);
    console.log(user);
    console.log(mediaType);
    await this.subscribeChannel(user, mediaType);
  }

  handleUserUnpublished(user): void {
    const id = user.uid;
    delete this.remoteUsers[id];
    const element = document.getElementById(`player-wrapper-${id}`);
    if (element) {
      element.remove();
    }
  }

  async subscribeChannel(user, mediaType): Promise<void> {
    const uid = user.uid;
    console.log(uid);
    console.log(user);
    await this.client.subscribe(user, mediaType);
    console.log('subscribe success');
    if (mediaType === 'video') {
      console.log(mediaType);
      const playerElement = document.createElement('div');
      console.log(playerElement);
      document.getElementById('remote-player-list').append(playerElement);
      playerElement.outerHTML = `
        <div id="player-wrapper-${uid}">
          <p class="player-name">remoteUser(${uid})</p>
          <div id="player-${uid}" class="player"></div>
        </div>
      `;
      console.log(playerElement.outerHTML);
      user.localTracks.videoTrack.play();
    }
    if (mediaType === 'audio') {
      console.log(user);
      console.log(mediaType);
      user.audioTrack.play();
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
    const thisClient = this.getClient();
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
        this.localTracks.videoTrack.close(),
        this.localTracks.audioTrack.close(),
        thisClient.unpublish(Object.values(this.localTracks)),
        this.client.leave(),
        this.leaveFromSession(channelName),
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
