import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Day } from '../interfaces/day';
import { Log, LogWithUser } from '../interfaces/log';
import { User } from '../interfaces/user';
import { UserService } from './user.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

  getDailyLogByUid(
    teamId: string,
    monthId: string,
    dayId: string,
    uid: string
  ): Observable<Day> {
    if (!teamId || !monthId || uid) {
      return of(null);
    } else {
      return this.db
        .doc<Day>(`teams/${teamId}/logs/${monthId}/days/${dayId}/uids/${uid}`)
        .valueChanges();
    }
  }

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

  getDailyLogsByUid(
    teamId: string,
    monthId: string,
    uid: string
  ): Observable<Day[]> {
    if (!teamId || !monthId || !uid) {
      return of(null);
    } else {
      return this.db
        .collectionGroup<Day>(`uids`, (ref) =>
          ref
            .where('monthId', '==', monthId)
            .where('teamId', '==', teamId)
            .where('uid', '==', uid)
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
              new Set(days.map((day) => day.uid))
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
                user: users.find((user: User) => day.uid === user?.uid),
              };
            });
          } else {
            return [];
          }
        })
      );
    }
  }
  updateLog(
    log: Omit<Log, 'activeTeamId' | 'commutingFee' | 'location'>
  ): Promise<void> {
    if (!log) {
      return;
    } else {
      this.db
        .doc<Omit<Log, 'activeTeamId' | 'commutingFee' | 'location'>>(
          `teams/${log.teamId}/logs/${log.monthId}/days/${log.dayId}/uids/${log.uid}`
        )
        .set(
          {
            logedInAt: log.logedInAt,
            logedOutAt: log.logedOutAt,
            tookBreakAt: log.tookBreakAt,
            backedBreakAt: log.backedBreakAt,
            updatedAt: firebase.default.firestore.Timestamp.now(),
            uid: log.uid,
            teamId: log.teamId,
            monthId: log.monthId,
            dayId: log.dayId,
          },
          { merge: true }
        );

      this.db
        .doc<Omit<Day, 'activeTeamId' | 'isWorking'>>(
          `users/${log.uid}/logs/${log.monthId}/days/${log.dayId}`
        )
        .set(
          {
            logedInAt: log.logedInAt,
            logedOutAt: log.logedOutAt,
            tookBreakAt: log.tookBreakAt,
            backedBreakAt: log.backedBreakAt,
            updatedAt: firebase.default.firestore.Timestamp.now(),
            uid: log.uid,
            monthId: log.monthId,
            dayId: log.dayId,
            teamId: log.teamId,
          },
          {
            merge: true,
          }
        );
    }
  }
}
