import express from 'express';
import expressJwt from 'express-jwt';
import QcSms from 'qcloudsms_js';
import { expressJwtOptions } from '../utils.mjs';
import { error, sms } from '../config.mjs';

const router = new express.Router();
const qcsms = new QcSms(sms.appId, sms.appKey);

/*
根据模板单发短信
短信接口参数：https://cloud.tencent.com/document/product/382/5976
SDK参考：https://github.com/qcloudsms/qcloudsms_js/blob/f179682bbe70a45775fcb2e76b8b19c2729da704/lib/sms.js#L83
*/
router.put(
  '/send/single',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const {
      sign, tel, params, tplId, ext, extend,
    } = req.body;
    if (!tel) return res.fail('必须提供电话号码');

    const sender = qcsms.SmsSingleSender();
    sender.sendWithParam(
      tel.nationcode, // 国家区号
      [tel.mobile], // 电话号码
      tplId || sms.templateId, // 模板ID
      params, // 模板参数
      sign || sms.sign, // 短信签名
      extend, // extend
      ext, // session内容
      (err, res2, resData) => {
        if (err) {
          error('/send', err);
          res.fail('server error', err);
        } else {
          res.success(resData);
        }
      },
    );
  },
);

export default router;
