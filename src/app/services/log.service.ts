import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StickerMessage } from 'messaging-api-line/dist/LineTypes';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Day } from '../interfaces/day';
import { Log, LogWithUser } from '../interfaces/log';
import { User } from '../interfaces/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

  getDailyLogsByTeamId(teamId: string, logId: string): Observable<Day[]> {
    if (!teamId || !logId) {
      return of(null);
    } else {
      return this.db
        .collectionGroup<Day>(`days`, (ref) =>
          ref.where('monthId', '==', logId).orderBy('logedInAt', 'desc')
        )
        .valueChanges();
    }
  }

  getDailyLogsWithUser(
    teamId: string,
    logId: string
  ): Observable<LogWithUser[]> {
    if (teamId === undefined) {
      return of(null);
    } else {
      return this.getDailyLogsByTeamId(teamId, logId).pipe(
        switchMap((days: Day[]) => {
          if (days.length) {
            const unduplicatedUids: string[] = Array.from(
              new Set(days.map((day) => day.userId))
            );

            const users$: Observable<User[]> = combineLatest(
              unduplicatedUids.map((uid: string) =>
                this.userService.getUserData(uid)
              )
            );
            return combineLatest([of(days), users$]);
          } else {
            return of([]);
          }
        }),
        map(([days, users]) => {
          if (days?.length) {
            return days.map((day: Day) => {
              return {
                ...day,
                user: users.find((user: User) => day.userId === user?.uid),
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
