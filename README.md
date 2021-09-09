# TL;DR

How to deploy transcoder:
1. Download and install Docker into the server. Make sure that the server has working internet connection.
2. Open the server's command line interface.
3. Deploy the transcoder by running the following command:
```sh
  docker run --name transcoder -d -p 80:80 -v /dev/shm:/tmp imamkhaira/rtsp-to-hls:latest
```
4. Configure nginx to proxy /transcode request to the server's listening port (see point D). 


# Complete Description


## A. Description

this aims to make a software to convert a RTSP stream from china CCTV to modern HLS stream.
request can be made via API calls and it includes automatic shutdown of unused streams.

## B. Running with Docker
use below steps if you'd like to use Docker.

### A.1. Using the Docker image
for quick testing or deployment, just run this image using Docker with following command:
```sh
docker run --name transcoder -d -p 80:80 -v /dev/shm:/tmp imamkhaira/rtsp-to-hls:latest
```
Note:
- the transcoder is listening on port 80 in the container.
- if your server have enough memory, you can improve performance by mounting the host' ramdisk (in this case is `/dev/shm`) into the container's `/tmp`. by doing this, the container's temporary files will be put in RAM instead of making large writes in the disk. thus, this will greatly reduce disk I/O and improves overall performance.
- please read your operating system's documentation regarding the location of ramdisk or how to make one.

### A.2. Using the transcoder
once the container is up and running, you can start transcoding by sending HTTP POST request into `http://<your ip>:<PORT>/transcode` with the following body:
```json
{
  "url": "<your cctv's rtsp url>"
}
```

the transcoder will process the stream (takes up to 30 s) and replied with following response format:
```json
{
  "error" : true | false,
  "stream" : "http://<your ip>:<PORT>/output/<unique stream ID>"
}
```

### A.3 Testing transcoded stream
you can then play the `stream` part of the response in the browser using either:
- [HLS.js][hls]
- [Video.js][vjs]

or if you just wanted to check, simply paste the `stream` into:
- [VLC][vlc]
- QuickTime Player.

### A.4. Sample code
below is a sample of Typescript code:
```ts

interface TranscoderResponse {
  error: boolean;
  stream: string;
}

async function start(): Promise<void> {
    try {
      this.isLoading = true;
      const { error, stream } = await http
        .post<TranscoderResponse>(
          `http://192.168.100.1/transcode`,
          { url: 'rtsp://192.168.100.2:554/ch01.264' },
        );
        
      if (error === true) throw new Error();

      this.renderer = new Hls();
      this.renderer.loadSource(this.transcoder + stream);
      this.renderer.attachMedia(this.video.nativeElement);
      this.video.nativeElement.play();
    } catch (error) {
      this.isError = true;
    } finally {
      this.isLoading = false;
    }
  }
```


## C. Running from source code
in any case, if you prefer to run bare-metal, you can just follow steps below.

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


6.  Follow step A.3 above for testing.
7.  please do note that, you may need to change the source code to use your computer's ramdisk instead of `/tmp`.


## D. Proxying and exposing to the Internet.
You can use nginx to proxy request without directly exposing the
transcoder to the Internet.
Additionally, you can add header checking and CORS headers as deemed appropriate.

Sample nginx config:
```txt

# this endpoint is accessible at https://<public_ip>:8300/transcode
server {
    listen 8300 ssl;
    listen [::]:8300 ssl;
    #server_name 192.168.100.83;
    #server_name localhost;
    server_name tsf.xtend.my.id;

    include snippets/tsf.xtend.my.id-ssl.conf;
    error_log /var/log/nginx/tsf-transcoder.error.log;
    access_log /var/log/nginx/tsf-transcoder.access.log;
 
    location / {
    		# transcoder is mapped to port 3000
        proxy_pass http://localhost:3000;
        proxy_pass_request_headers on;
    }
}
```


## E. Issues and bugs

Should you encounter any issues or bugs, please report to me via imamkhaira (at) gmail (dot) com.

[hls]: https://github.com/video-dev/hls.js/
[vjs]: https://videojs.com/
[vlc]: https://www.videolan.org/
