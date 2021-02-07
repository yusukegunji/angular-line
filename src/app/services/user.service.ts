import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JoinedUid } from 'functions/interfaces/joined-uid';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Log, LogWithTeam } from '../interfaces/log';
import { Team } from '../interfaces/team';
import { User, UserWithLogs } from '../interfaces/user';
import { TeamService } from './team.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isProcessing: boolean;

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private fnc: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private teamService: TeamService
  ) {}

  joinTeam(teamId: string, uid: string): void {
    this.db.doc(`teams/${teamId}/joinedUids/${uid}`).set({
      teamId,
      uid,
    });
    this.db.doc(`users/${uid}/joinedTeams/${teamId}`).set({ teamId });
  }

  getUserData(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  getjoinedUsers(teamId: string): Observable<User[]> {
    return this.db
      .collectionGroup<JoinedUid>('joinedUids', (ref) =>
        ref.where('teamId', '==', teamId)
      )
      .valueChanges()
      .pipe(
        switchMap((joinedUids) => {
          if (joinedUids.length) {
            return combineLatest(
              joinedUids.map((joinedUid) => this.getUserData(joinedUid.uid))
            );
          } else {
            return of(null);
          }
        })
      );
  }

  getMonthlyLogsByUid(
    teamId: string,
    monthId: string,
    uid: string
  ): Observable<Log[]> {
    if (!teamId || !monthId || !uid) {
      return of(null);
    } else {
      return this.db
        .collectionGroup<Log>(`days`, (ref) =>
          ref
            .where('monthId', '==', monthId)
            .where('teamId', '==', teamId)
            .where('uid', '==', uid)
            .orderBy('logedInAt', 'desc')
        )
        .valueChanges();
    }
  }

  getMonthlyLogsWithTeamByUid(
    teamId: string,
    monthId: string,
    uid: string
  ): Observable<LogWithTeam[]> {
    if (!teamId || !monthId || !uid) {
      return of(null);
    } else {
      return this.getMonthlyLogsByUid(teamId, monthId, uid).pipe(
        switchMap((logs: Log[]) => {
          if (logs.length) {
            const unduplicatedTeamIds: string[] = Array.from(
              new Set(logs.map((log) => log.teamId))
            );

            const teams$: Observable<Team[]> = combineLatest(
              unduplicatedTeamIds.map((tId: string) => {
                return this.teamService.getTeam(tId);
              })
            );
            return combineLatest([of(logs), teams$]);
          } else {
            return of([]);
          }
        }),
        map(([logs, teams]) => {
          if (logs?.length) {
            return logs.map((log: Log) => {
              return {
                ...log,
                team: teams.find((team: Team) => log.teamId === team.teamId),
              };
            });
          } else {
            return [];
          }
        })
      );
    }
  }

  getJoinedUsersWithLogs(
    teamId: string,
    monthId: string
  ): Observable<UserWithLogs[]> {
    if (teamId === undefined || monthId === undefined) {
      return of(null);
    } else {
      this.getjoinedUsers(teamId).pipe(
        switchMap((joinedUsers) =>
          joinedUsers.map((joinedUser) => {
            return this.getMonthlyLogsByUid(
              teamId,
              monthId,
              joinedUser.uid
            ).pipe(
              switchMap((logs: Log[]) => {
                if (logs.length) {
                  const unduplicatedUids: string[] = Array.from(
                    new Set(logs.map((log) => log.uid))
                  );

                  const users$: Observable<User[]> = combineLatest(
                    unduplicatedUids.map((userId: string) =>
                      this.getUserData(userId)
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
          })
        )
      );
    }
  }

  async updateUser(
    user: Omit<
      User,
      'createdAt' | 'email' | 'isWorking' | 'isAdmin' | 'result' | 'plan'
    >
  ): Promise<void> {
    await this.db.doc<User>(`users/${user.uid}`).update({
      ...user,
    });
    this.router.navigate(['/']);
  }

  async deleteUser(uid: string): Promise<void> {
    this.isProcessing = true;
    const callable = this.fnc.httpsCallable('deleteAfUser');
    return callable(uid)
      .toPromise()
      .then(() => {
        this.snackBar.open('ご利用ありがとうございました');
        this.router.navigateByUrl('/welcome');
      })
      .finally(() => {
        this.isProcessing = false;
      });
  }
}
