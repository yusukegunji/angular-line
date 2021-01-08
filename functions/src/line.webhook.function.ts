import * as functions from 'firebase-functions';
import { LineClient } from 'messaging-api-line';

const client = new LineClient({
  accessToken: functions.config().line.message_token,
  channelSecret: functions.config().line.message_secret,
});

export const lineWebhook = functions.https.onRequest(
  async (request, response) => {
    const event = request.body.events[0];

    if (event.type === 'message') {
      await client.reply(event.replyToken, [
        {
          type: 'text',
          text: 'test',
        },
      ]);
    }
  }
);
