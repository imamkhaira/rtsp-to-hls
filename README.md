## RTSP-to-HLS

### Description

this aims to make a software to convert a RTSP stream from china CCTV to modern HLS stream.
request can be made via API calls and it includes automatic shutdown of unused streams.

## How to use

1.  copy `.env.example` to `.env`
2.  make changes accoirding to your needs.
3.  test run by executing `npm start`
4.  if OK, run for production by running `npm run deploy`
5.  start transcoding by making HTTP POST request as follows:

    ```sh

    # this is an example
    # CAPITALIZED words are variables inside .env
    curl --location --request POST 'http://<your ip>:<PORT>/transcode' \
    --header 'Content-Type: application/json' \
    --data-raw '{ "url": "rtsp://<your cctv url>" }'

    # response
    ' {"error":false,"stream":"/<OUTPUT_DIR>/<generated I>/index.m3u8"}'
    ```

6.  if you can watch the index.m3u8 file directly using QuickTime Player or VLC, then you can simply use it in browser with HLS.js.

## Issues and bugs

Should you encounter any issues or bugs, please report to me via imamkhaira (at) gmail (dot) com.
