import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const judgementPassword = functions
  .region('asia-northeast1')
  .https.onCall(async (data: any) => {
    const team = (await db.doc(`private/${data.teamId}`).get()).data() as any;
    const password = team.password;
    try {
      if (data.password === password) {
        return true;
      } else {
        return false;
      }
    } catch {
      throw new Error('認証に失敗しました');
    }
  });
