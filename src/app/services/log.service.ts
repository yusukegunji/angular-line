import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StickerMessage } from 'messaging-api-line/dist/LineTypes';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Log, LogWithUser } from '../interfaces/log';
import { User } from '../interfaces/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

  getLogsByTeamId(teamId: string): Observable<Log[]> {
    return this.db
      .collection<Log>(`logs`, (ref) => {
        if (!teamId) {
          return;
        } else {
          return ref.where('teamId', '==', teamId).orderBy('logedInAt', 'desc');
        }
      })
      .valueChanges();
  }

  getLogsWithUser(teamId: string): Observable<LogWithUser[]> {
    if (teamId === undefined) {
      console.log(teamId);

      return of(null);
    } else {
      console.log('check');

      return this.getLogsByTeamId(teamId).pipe(
        switchMap((logs: Log[]) => {
          if (logs.length) {
            const unduplicatedUids: string[] = Array.from(
              new Set(logs.map((log) => log.uid))
            );

            const users$: Observable<User[]> = combineLatest(
              unduplicatedUids.map((uid: string) =>
                this.userService.getUserData(uid)
              )
            );
            return combineLatest([of(logs), users$]);
          } else {
            return of([]);
          }
        }),
        map(([logs, users]) => {
          if (logs?.length) {
            return logs.map((log: Log) => {
              return {
                ...log,
                user: users.find((user: User) => log.uid === user?.uid),
              };
            });
          } else {
            return [];
          }
        })
      );
    }
  }
}
