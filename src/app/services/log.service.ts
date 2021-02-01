import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

  getDailyLogsByTeamId(teamId: string, monthId: string): Observable<Day[]> {
    if (!teamId || !monthId) {
      return of(null);
    } else {
      return this.db
        .collectionGroup<Day>(`uids`, (ref) =>
          ref
            .where('monthId', '==', monthId)
            .where('teamId', '==', teamId)
            .orderBy('logedInAt', 'desc')
        )
        .valueChanges();
    }
  }

  getDailyLogsByUserId(
    teamId: string,
    monthId: string,
    userId: string
  ): Observable<Day[]> {
    if (!teamId || !monthId || !userId) {
      return of(null);
    } else {
      return this.db
        .collectionGroup<Day>(`uids`, (ref) =>
          ref
            .where('monthId', '==', monthId)
            .where('teamId', '==', teamId)
            .where('userId', '==', userId)
            .orderBy('logedInAt', 'desc')
        )
        .valueChanges();
    }
  }

  getDailyLogsWithUser(
    teamId: string,
    monthId: string
  ): Observable<LogWithUser[]> {
    if (teamId === undefined) {
      return of(null);
    } else {
      return this.getDailyLogsByTeamId(teamId, monthId).pipe(
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
