import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as admin from 'firebase-admin';

export const db = admin.firestore();

db.settings({
  ignoreUndefinedProperties: true,
});

export const createState = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    // ランダム文字列を生成
    const state: string = admin.firestore().collection('_').doc().id;
    await admin.firestore().doc(`states/${state}`).set({ state });
    return state;
  });

export const getLineCodeWebhook = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    const isValidState = (await admin.firestore().doc(`states/${state}`).get())
      .exists;

    if (!isValidState) {
      return;
    }

    if (code) {
      res.redirect(`http://localhost:4200/welcome/login?code=${code}`);
    } else {
      res.redirect(`http://localhost:4200`);
    }
  });

/**
 * 認可コードをLINEアクセストークンを取得
 * @param code 認可コード
 */
const getAccessToken = async (code: string) => {
  return fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: functions.config().line.client_id,
      client_secret: functions.config().line.secret,
      redirect_uri:
        'https://asia-northeast1-line-demo-a1a08.cloudfunctions.net/getLineCodeWebhook',
    }),
  }).then((r) => r.json());
};

/**
 * アクセスコードを使ってLINEトークン＆ユーザー情報を取得
 */
export const getCustomToken = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!data) {
      return;
    }

    // 認可コードを使ってアクセストークン&ユーザーを取得
    const lineUser = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        id_token: (await getAccessToken(data.code)).id_token,
        client_id: functions.config().line.client_id,
      }),
    }).then((r) => r.json());

    // Firebaseログインに用いるUIDを管理
    let uid: string = context.auth?.uid as string;

    // LINE連携済みのユーザーを取得
    const connectedUser = (
      await admin
        .firestore()
        .collection('users')
        .where('lineId', '==', lineUser.sub)
        .get()
    ).docs[0];

    if (uid && !connectedUser) {
      // ログイン中のユーザーにLINEを連携
      await admin.firestore().doc(`users/${uid}`).set(
        {
          lineId: lineUser.sub,
        },
        { merge: true }
      );
    } else if (!uid && connectedUser) {
      // LINE連携済み既存ユーザーID
      uid = connectedUser.id;
    } else if (!uid && !connectedUser) {
      // 未ログインかつ連携済みユーザーがいなければユーザー新規作成
      uid = lineUser.sub;

      await admin.firestore().doc(`users/${uid}`).set(
        {
          lineId: lineUser.sub,
          name: lineUser.name,
          photoURL: lineUser.picture,
          email: lineUser.email,
          createdAt: new Date(),
        },
        { merge: true }
      );
    }

    return await admin.auth().createCustomToken(uid);
  });
