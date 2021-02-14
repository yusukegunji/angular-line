import { Injectable } from '@angular/core';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isProcessing: boolean;
  constructor(
    private fnc: AngularFireFunctions,
    private router: Router,
    private snackBar: MatSnackBar
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

  async joinChannel(uid: string, channelName: string): Promise<number> {
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
    this.client.on('user-published', this.handleUserPublished);
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
    // subscribe to a remote user
    await this.client.subscribe(user, mediaType);
    console.log('subscribe success');
    if (mediaType === 'video') {
      const playerElement = document.createElement('div');
      document.getElementById('remote-player-list').append(playerElement);
      playerElement.outerHTML = `
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `;
      user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  }

  async leaveChannel(client: IAgoraRTCClient): Promise<void> {
    client.localTracks.forEach((value) => value.close());
    this.handleUserUnpublished(client);
    await client.leave();
  }
}
