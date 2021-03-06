import * as functions from 'firebase-functions';
import { LineClient } from 'messaging-api-line';
import * as admin from 'firebase-admin';
import request = require('request');

export const db = admin.firestore();

const client = new LineClient({
  accessToken: functions.config().line.message_token,
  channelSecret: functions.config().line.message_secret,
});

export const lineMsgApi = functions
  .region('asia-northeast1')
  .runWith({ memory: '1GB' })
  .https.onRequest(async (req: any, res: any) => {
    const event = req.body.events[0];
    const uid = event.source.userId;
    const timestamp = admin.firestore.Timestamp.now();
    const date = timestamp.toDate();
    const yyyyMM =
      `${date.getFullYear()}` +
      `${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }`;
    const yyyyMMdd =
      `${date.getFullYear()}` +
      `${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }` +
      `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
    const replyToken = event.replyToken;
    let userText = '';

    const activeTeamId = await db
      .doc(`users/${uid}`)
      .get()
      .then(async (user: any) => {
        if (user.data().activeTeamId) {
          return user.data().activeTeamId;
        } else {
          return null;
        }
      });

    if (!activeTeamId) {
      if (event.type === 'message' && event.message.type === 'text') {
        userText = event.message.text;
        const isTeamId = await db
          .doc(`teams/${userText}`)
          .get()
          .then(
            async (data: any): Promise<boolean | undefined> => {
              if (data.exists) {
                return true;
              } else {
                return;
              }
            }
          );

        if (isTeamId) {
          await db.doc(`teams/${userText}/joinedUids/${uid}`).set({
            uid,
            activeTeamId: userText,
            joinedAt: timestamp,
          });

          await db.doc(`users/${uid}`).set(
            {
              activeTeamId: userText,
              joinedAt: timestamp,
            },
            {
              merge: true,
            }
          );

          await db
            .doc(`users/${uid}`)
            .get()
            .then(async (user: any) => {
              if (user.exists) {
                const name = user.data().name;
                await db
                  .doc(`teams/${userText}`)
                  .get()
                  .then(async (team: any) => {
                    const thumbnailURL = team.data().thumbnailURL;
                    const newTeamName = team.data().name;

                    await client.replyFlex(
                      event.replyToken,
                      'this is a message',
                      {
                        type: 'bubble',
                        hero: {
                          type: 'image',
                          url: `${thumbnailURL}`,
                          size: 'full',
                          aspectRatio: '20:13',
                          aspectMode: 'cover',
                          action: {
                            type: 'uri',
                            label: 'Line',
                            uri: `http://line-demo-a1a08.web.app/team/${userText}`,
                          },
                        },
                        body: {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              text: `ようこそ、${name}さん`,
                              size: 'xl',
                              weight: 'bold',
                            },
                            {
                              type: 'box',
                              layout: 'baseline',
                              margin: 'md',
                              contents: [
                                {
                                  type: 'text',
                                  text: `${newTeamName}をアクティブにしました！`,
                                  flex: 0,
                                  margin: 'md',
                                  size: 'md',
                                  color: '#000000',
                                },
                              ],
                            },
                          ],
                        },
                      }
                    );
                  });
              }
            });
        } else {
          replyMessage(
            replyToken,
            'まずはチームIDを入力してチームをアクティブにしましょう！'
          );
        }
      } else {
        replyMessage(
          replyToken,
          'まずはチームIDを入力してチームをアクティブにしましょう！'
        );
      }
      return res.status(200).send(req.method);
    } else {
      if (event.type === 'message' && event.message.type === 'text') {
        if (activeTeamId !== null) {
          userText = event.message.text;
          const isTeamId = await db
            .doc(`teams/${userText}`)
            .get()
            .then(
              async (data: any): Promise<boolean | undefined> => {
                if (data.exists) {
                  return true;
                } else {
                  return;
                }
              }
            );
          if (!isTeamId) {
            const teamName = await db
              .doc(`teams/${activeTeamId}`)
              .get()
              .then(async (user: any) => {
                if (user.exists) {
                  return user.data().name;
                } else {
                  return null;
                }
              });

            if (event.message.text === '出勤する') {
              const monthId = yyyyMM;
              const dayId = yyyyMMdd;

              await db
                .doc(`teams/${activeTeamId}/logs/${yyyyMM}`)
                .set({ monthId });

              await db
                .doc(`teams/${activeTeamId}/logs/${yyyyMM}/days/${yyyyMMdd}`)
                .set({ dayId });

              await db
                .doc(
                  `teams/${activeTeamId}/logs/${yyyyMM}/days/${yyyyMMdd}/uids/${uid}`
                )
                .set({
                  uid,
                  teamId: activeTeamId,
                  logedInAt: timestamp,
                  monthId,
                  dayId,
                });

              await db.doc(`users/${uid}`).set(
                {
                  isWorking: true,
                },
                {
                  merge: true,
                }
              );

              await db.doc(`users/${uid}/logs/${yyyyMM}`).set({ monthId });

              await db
                .doc(`users/${uid}/logs/${yyyyMM}/days/${yyyyMMdd}`)
                .set({ dayId });

              await db.doc(`users/${uid}/logs/${yyyyMM}/days/${yyyyMMdd}`).set({
                uid,
                teamId: activeTeamId,
                logedInAt: timestamp,
                monthId,
                dayId,
              });

              replyMessage(
                replyToken,
                `${teamName}で出勤しました🎉今日も一日ガンバりましょう！`
              );
            } else if (event.message.text === '退勤する') {
              await db
                .doc(
                  `teams/${activeTeamId}/logs/${yyyyMM}/days/${yyyyMMdd}/uids/${uid}`
                )
                .set(
                  {
                    uid,
                    activeTeamId,
                    logedOutAt: timestamp,
                  },
                  {
                    merge: true,
                  }
                );

              await db.doc(`users/${uid}/logs/${yyyyMM}/days/${yyyyMMdd}`).set(
                {
                  uid,
                  activeTeamId,
                  logedOutAt: timestamp,
                },
                {
                  merge: true,
                }
              );

              await db.doc(`users/${uid}`).set(
                {
                  isWorking: false,
                },
                {
                  merge: true,
                }
              );

              replyMessage(
                replyToken,
                `お疲れさまでした！${teamName}で退勤しました♨️`
              );
            } else if (event.message.text === '休憩IN') {
              await db
                .doc(
                  `teams/${activeTeamId}/logs/${yyyyMM}/days/${yyyyMMdd}/uids/${uid}`
                )
                .set(
                  {
                    uid,
                    activeTeamId,
                    tookBreakAt: timestamp,
                  },
                  {
                    merge: true,
                  }
                );

              await db.doc(`users/${uid}/logs/${yyyyMM}/days/${yyyyMMdd}`).set(
                {
                  uid,
                  activeTeamId,
                  tookBreakAt: timestamp,
                },
                {
                  merge: true,
                }
              );

              await db.doc(`users/${uid}`).set(
                {
                  isWorking: false,
                },
                {
                  merge: true,
                }
              );

              replyMessage(replyToken, `いってらっしゃい☕️`);
            } else if (event.message.text === '休憩OUT') {
              await db
                .doc(
                  `teams/${activeTeamId}/logs/${yyyyMM}/days/${yyyyMMdd}/uids/${uid}`
                )
                .set(
                  {
                    uid,
                    activeTeamId,
                    backedBreakAt: timestamp,
                  },
                  {
                    merge: true,
                  }
                );

              await db.doc(`users/${uid}/logs/${yyyyMM}/days/${yyyyMMdd}`).set(
                {
                  uid,
                  activeTeamId,
                  backedBreakAt: timestamp,
                },
                {
                  merge: true,
                }
              );

              await db.doc(`users/${uid}`).set(
                {
                  isWorking: true,
                },
                {
                  merge: true,
                }
              );

              replyMessage(replyToken, `おかえりなさい✋`);
            } else if (event.message.text === '状況を確認') {
              await db
                .doc(`teams/${activeTeamId}`)
                .get()
                .then(async (team: any) => {
                  const thumbnailURL = team.data().thumbnailURL;
                  const activeTeamName = team.data().name;

                  await client.replyFlex(event.replyToken, 'this is a link', {
                    type: 'bubble',
                    hero: {
                      type: 'image',
                      url: `${thumbnailURL}`,
                      size: 'full',
                      aspectRatio: '20:13',
                      aspectMode: 'cover',
                      action: {
                        type: 'uri',
                        label: 'Line',
                        uri: `http://line-demo-a1a08.web.app/team/${activeTeamId}`,
                      },
                    },
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: `${activeTeamName}の状況確認ですね？`,
                          size: 'xl',
                          weight: 'bold',
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          margin: 'md',
                          contents: [
                            {
                              type: 'text',
                              text: `上の画像をタップすると今の状況を確認できます🔖`,
                              flex: 0,
                              margin: 'md',
                              size: 'md',
                              color: '#000000',
                            },
                          ],
                        },
                      ],
                    },
                  });
                });
            } else if (event.message.text === 'チームを出る') {
              await db.doc(`users/${uid}`).update({
                activeTeamId: '',
              });

              replyMessage(
                replyToken,
                `${teamName}から出ました。他のチームに入室するには、再度チームIDを送信してください🙇‍♂️`
              );
            } else {
              replyMessage(
                replyToken,
                `すみません、メニューから選んでください🙏`
              );
            }
          } else {
            replyMessage(
              replyToken,
              `すみません、一度ルームから出て別のチームIDを送信してください🙏`
            );
          }
        } else {
          userText = event.message.text;
          const isTeamId = await db
            .doc(`teams/${userText}`)
            .get()
            .then(
              async (data: any): Promise<boolean | undefined> => {
                if (data.exists) {
                  return true;
                } else {
                  return;
                }
              }
            );

          if (isTeamId) {
            await db.doc(`users/${uid}`).update({
              uid,
              activeTeamId: userText,
              joinedAt: timestamp,
            });

            await db
              .collection('users')
              .doc(uid)
              .get()
              .then(async (user: any) => {
                if (user.exists) {
                  const name = user.data().name;
                  await db
                    .collection(`teams/${userText}`)
                    .get()
                    .then(async (room: any) => {
                      const thumbnailURL = room.data().thumbnailURL;
                      const newRoomName = room.data().name;

                      await client.replyFlex(
                        event.replyToken,
                        'this is a message',
                        {
                          type: 'bubble',
                          hero: {
                            type: 'image',
                            url: `${thumbnailURL}`,
                            size: 'full',
                            aspectRatio: '20:13',
                            aspectMode: 'cover',
                            action: {
                              type: 'uri',
                              label: 'Line',
                              uri: `http://localhost:4200/team/${userText}`,
                            },
                          },
                          body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              {
                                type: 'text',
                                text: `ようこそ、${name}さん`,
                                size: 'xl',
                                weight: 'bold',
                              },
                              {
                                type: 'box',
                                layout: 'baseline',
                                margin: 'md',
                                contents: [
                                  {
                                    type: 'text',
                                    text: `${newRoomName}がアクティブになりました！`,
                                    flex: 0,
                                    margin: 'md',
                                    size: 'md',
                                    color: '#000000',
                                  },
                                ],
                              },
                            ],
                          },
                        }
                      );
                    });
                }
              });
          } else {
            replyMessage(
              replyToken,
              'まずはチームIDを入力してチームをアクティブにしましょう！'
            );
          }
        }
      } else {
        replyMessage(replyToken, 'すみません、メニューから選んでください🙏');
      }
      return res.status(200).send(req.method);
    }
  });

const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${client.accessToken}`,
};

function replyMessage(replytoken: any, textfrom: any): request.Request {
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
