import Express from 'express';
import { logger } from '@/utils'
import { API_PORT } from '@/config';
import Router from '@/routes';


const TranscoderApp = Express();
TranscoderApp.use(Router);

TranscoderApp.listen(API_PORT, () => {
  // tslint:disable-next-line: no-console
  logger(`Example app listening at http://localhost:${API_PORT}`);
});
