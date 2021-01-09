import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
