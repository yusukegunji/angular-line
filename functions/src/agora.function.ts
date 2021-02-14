import * as functions from 'firebase-functions';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

if (!functions.config().agora) {
  throw new Error('Config must be set; `functions.config().agora`');
}

const appId = functions.config().agora.app_id;
const appSecret = functions.config().agora.app_secret;

const expirationTimeInSeconds = 3600;

export const getChannelToken = functions
  .region('asia-northeast1')
  .https.onCall((data, context) => {
    const currentUserId = context.auth?.uid;
    if (!currentUserId) {
      functions.logger.info('currentUserId is null', '18');
      throw new functions.https.HttpsError(
        'permission-denied',
        'Can not logged In'
      );
    }
    functions.logger.info(data, '24');

    const channelId = data.channelName;
    if (!channelId || typeof channelId !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '`channelId` is required'
      );
    }
    functions.logger.info(channelId, '33');

    const token = generateToken(channelId, currentUserId);
    functions.logger.info(token, '36');

    return { channelId, token, currentUserId };
  });

function generateToken(channelName: string, uid: string): string {
  if (!appId) {
    throw new Error('Agora app Id is required');
  }

  if (!appSecret) {
    throw new Error('Agora app Secret is required');
  }

  if (!channelName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Channel name id required'
    );
  }

  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'Uid is reqired');
  }

  const role = RtcRole.PUBLISHER;
  functions.logger.info(role, '62');
  const privilegeExpiredTs =
    Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
  functions.logger.info(privilegeExpiredTs, '65');

  const token = RtcTokenBuilder.buildTokenWithAccount(
    appId,
    appSecret,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  functions.logger.info(token, '76');
  return token;
}
