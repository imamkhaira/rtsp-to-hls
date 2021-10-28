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

Test Alarm Fire Alarm Lantai 1 - Chilling Area 1.2.3.4 OFFLINE
Kitchen | Restricted Area IP Camera Lantai 1 - Front Office Recptionist 192.168.100.104 OFFLINE
Garage | People Counter Unknown Lantai 1 - Chilling Area 192.168.100.102 OFFLINE
IPC Recognition IP Camera Lantai 1 - Front Office Recptionist 192.168.100.121 OFFLINE
Garage IP Camera Lantai 1 - Herbalife Area 192.168.200.127 OFFLINE
Kitchen IP Camera Lantai 1 - Herbalife Area 192.168.100.238 OFFLINE
Back Lawn IP Camera Lantai 1 - Herbalife Area 192.168.100.239 OFFLINE
Receptionist IP Camera Lantai 1 - Herbalife Area 192.168.200.123 OFFLINE
Front Lawn IP Camera Lantai 1 - Herbalife Area 192.168.200.123 OFFLINE
PTZ Overwatch IP Camera Lantai 1 - Herbalife Area 192.168.10.141 OFFLINE
Office Receptionist, 192.168.100.126
Front Lawn CCTV IP Camera, 192.168.100.92
Ruang Kerja IP Camera, 192.168.100.125
