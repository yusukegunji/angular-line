import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export * from './auth.function';
export * from './user.function';
export { lineWebhook } from './line.webhook.function';
export { lineMsgAPI } from './line.msg.function';
export { judgementPassword } from './team.function';
export { countUpMember, countDownMember } from './join.event.function';
