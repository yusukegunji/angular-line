import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Team } from '../interfaces/team';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async createTeam(
    team: Omit<Team, 'teamId' | 'thumbnailURL' | 'updatedAt' | 'memberIds'>,
    thumbnailURL: string
  ): Promise<void> {
    const id = this.db.createId();
    const image = await this.setThumbnailToStorage(id, thumbnailURL);
    return this.db.doc<Team>(`teams/${id}`).set({
      ...team,
      teamId: id,
      updatedAt: firebase.default.firestore.Timestamp.now(),
      thumbnailURL: image,
    });
  }

  async setThumbnailToStorage(teamId: string, file: string): Promise<string> {
    const result = await this.storage
      .ref(`teams/${teamId}`)
      .putString(file, firebase.default.storage.StringFormat.DATA_URL);
    return result.ref.getDownloadURL();
  }

  getAllTeams(): Observable<Team[]> {
    return this.db.collection<Team>(`teams`).valueChanges();
  }

  getTeam(id: string): Observable<Team> {
    return this.db.doc<Team>(`teams/${id}`).valueChanges();
  }

  getSelfOwningTeams(uid: string): Observable<Team[]> {
    if (!uid) {
      return of(null);
    }
    return this.db
      .collectionGroup<Team>('teams', (ref) => ref.where('ownerId', '==', uid))
      .valueChanges();
  }

  getJoinedTeams(uid: string): Observable<Team[]> {
    if (!uid) {
      return of(null);
    }
    return this.db
      .collectionGroup<{
        teamId: string;
        uid: string;
      }>('joinedUids', (ref) => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(
        switchMap((joinedTeams) => {
          if (joinedTeams.length) {
            return combineLatest(
              joinedTeams.map((team) => this.getTeam(team.teamId))
            );
          } else {
            return of(null);
          }
        })
      );
  }
}
