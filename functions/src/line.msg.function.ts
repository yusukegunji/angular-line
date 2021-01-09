import * as functions from 'firebase-functions';
import { LineClient } from 'messaging-api-line';
import * as admin from 'firebase-admin';
import request = require('request');

export const db = admin.firestore();

const client = new LineClient({
  accessToken: functions.config().line.message_token,
  channelSecret: functions.config().line.message_secret,
});

export const lineMsgAPI = functions
  .region('asia-northeast1')
  .runWith({ memory: '1GB' })
  .https.onRequest(async (req: any, res: any) => {
    const event = req.body.events[0];
    const userId = event.source.userId;
    const timestamp = event.timestamp;
    const replyToken = event.replyToken;
    let userText = '';
    if (event.type === 'message' && event.message.type === 'text') {
      userText = event.message.text;
    } else {
      userText = '(Message type is not text)';
    }

    await db.collection('chat-history').doc(timestamp.toString()).set({
      userId,
      Message: userText,
      timestamp,
    });

    await db
      .collection('users')
      .doc(userId)
      .get()
      .then((returnData: any) => {
        if (returnData.exists) {
          const name = returnData.data().name;
          const photoURL = returnData.data().photoURL;
          functions.logger.info(returnData);
          reply_message(replyToken, `${name}が好き❤️`);
          reply_message(replyToken, `${photoURL}`);
        } else {
          reply_message(replyToken, 'You are not the customer, Register?');
        }
        return null;
      })
      .catch((err) => {
        console.log(err);
      });

    return res.status(200).send(req.method);
  });

const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${client.accessToken}`,
};

function reply_message(replytoken: any, textfrom: any): request.Request {
  return request.post({
    uri: `https://api.line.me/v2/bot/message/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: replytoken,
      messages: [
        {
          type: 'text',
          text: textfrom,
        },
      ],
    }),
  });
}
