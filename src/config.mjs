import debug from 'debug';

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const secret = process.env.SECRET || 'secret';

export const info = debug('qcloud-api:info');
export const error = debug('qcloud-api:error');

export const sms = {
  appId: process.env.SMS_APPID,
  appKey: process.env.SMS_APPKEY,
  sign: process.env.SMS_SIGN,
  templateId: process.env.SMS_TEMPLATE_ID,
};

export const cdnConfig = {
  appId: process.env.CDN_APPID || process.env.SMS_APPID,
  appKey: process.env.CDN_APPKEY || process.env.SMS_APPKEY,
};

