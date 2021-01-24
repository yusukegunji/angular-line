import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
/**
 * 初回認証時にユーザーデータを作成
 */
export const createUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate((user) => {
    return admin
      .firestore()
      .doc(`users/${user.uid}`)
      .set({
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        email: user.email || '',
        createdAt: new Date(),
      });
  });

export const deleteAfUser = functions
  .region('asia-northeast1')
  .https.onCall((data, _) => {
    return admin.auth().deleteUser(data);
  });

export const deleteUserAccount = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete(async (user, _) => {
    return db.doc(`users/${user.uid}`).delete();
  });
