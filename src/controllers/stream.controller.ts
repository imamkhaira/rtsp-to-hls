import express from 'express';

function stream_serveIndex(req: express.Request, res: express.Response) {
    return res.end(`
  <html>
    <h1>stream endpoint is reachable</h1>
  </html>
  `);
}
