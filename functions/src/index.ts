import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export * from './auth.function';
export * from './user.function';
export * from './participate.channel.function';
export * from './leave.channel.function';
export { lineMsgApi } from './line.msg.function';
export { judgementPassword } from './team.function';
export { countUpMember, countDownMember } from './join.event.function';
