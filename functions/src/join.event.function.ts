import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { shouldEventRun, markEventTried } from './utils/firebase.util';

const db = admin.firestore();

export const countUpMember = functions
  .region('asia-northeast1')
  .firestore.document('teams/{teamId}/joinedUids/{uid}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should) => {
      if (should) {
        await db
          .doc(`teams/${context.params.teamId}`)
          .update('memberCount', admin.firestore.FieldValue.increment(1));
        return markEventTried(eventId);
      } else {
        return;
      }
    });
  });

export const countDownMember = functions
  .region('asia-northeast1')
  .firestore.document('teams/{teamId}/joinedUids/{uid}')
  .onDelete(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should) => {
      if (should) {
        await db
          .doc(`teams/${context.params.teamId}`)
          .update('memberCount', admin.firestore.FieldValue.increment(-1));
        return markEventTried(eventId);
      } else {
        return;
      }
    });
  });
