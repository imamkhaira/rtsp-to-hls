import Express, { json } from 'express';
import { logger } from '@/utils';
import JSONResponse from '@/middlewares/json-response';
import { API_PORT } from '@/config';
import Modules from '@/modules';

const TranscoderApp = Express();

TranscoderApp.use(Express.json());
TranscoderApp.use(Express.urlencoded({ extended: true }));
TranscoderApp.use(JSONResponse);

TranscoderApp.use(Modules);

TranscoderApp.listen(API_PORT, () => {
  logger(`Example app listening at http://localhost:${API_PORT}`);
});
