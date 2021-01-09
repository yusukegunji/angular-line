import * as functions from 'firebase-functions';
import { LineClient } from 'messaging-api-line';
import * as admin from 'firebase-admin';

export const db = admin.firestore();

const client = new LineClient({
  accessToken: functions.config().line.message_token,
  channelSecret: functions.config().line.message_secret,
});

export const lineWebhook = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const event = req.body.events[0];

    if (event.type === 'message') {
      await client.reply(event.replyToken, [
        {
          type: 'text',
          text: 'メッセージありがとう',
        },
      ]);
    }
  });
