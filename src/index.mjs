import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { host, port, secret, info } from './config.mjs';

import sms from './controllers/sms.mjs';
import cdn from './controllers/cdn.mjs';

const app = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cookieParser(secret));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('*', (req, res, next) => {
  res.success = data => res.json({
    ret: 0,
    data,
  });
  res.fail = (msg, err) => {
    res.json({
      ret: -1,
      msg,
      err,
    });
  };
  next();
});
app.use('/sms', sms);
app.use('/cdn', cdn);

app.listen(port, () => {
  info(`The server is running at http://${host}`);
});
