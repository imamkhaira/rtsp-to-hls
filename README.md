## RTSP-to-HLS

## A. Description

This aims to make a software to convert a RTSP stream from china CCTV to modern HLS stream.
request can be made via API calls and it includes automatic shutdown of unused streams.

## B. Running with Docker

Use below steps if you'd like to use Docker.

### A.1. Using the Docker image

for quick testing or deployment, just run this image using Docker with following command:

```sh
docker run --name transcoder -d -p 80:80 -v /dev/shm:/tmp imamkhaira/rtsp-to-hls:latest
```

Note:

-   the transcoder is listening on port 80 in the container.
-   if your server have enough memory, you can improve performance by mounting the host' ramdisk (in ubuntu, it is `/dev/shm`) into the container's `/tmp`. by doing this, the container's temporary files will be put in RAM instead of making large writes in the disk. thus, this will greatly reduce disk I/O and improves overall performance.
-   please read your operating system's documentation regarding the location of ramdisk or how to make one.

### A.2. Using the transcoder

once the container is up and running, you can start transcoding by sending HTTP POST request into `http://<your ip>:<PORT>/transcode` with the following body:

```json
{
    "url": "<your cctv's rtsp url>"
}
```

You MUST make sure that the request' `Content-Type` header is set to `application/json`.
The transcoder will then process the stream (takes up to 30 s) and replied with following response format:

```json
{
  "error" : true | false,
  "stream" : "http://<your ip>:<PORT>/output/<unique stream ID>"
}
```

### A.3 Testing transcoded stream

you can then play the `stream` part of the response in the browser using either:

-   [HLS.js][hls]
-   [Video.js][vjs]

or if you just wanted to check, simply paste the `stream` into:

-   [VLC][vlc]
-   QuickTime Player.

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
        const { error, stream } = await http.post<TranscoderResponse>(
            `http://192.168.100.1/transcode`,
            { url: 'rtsp://192.168.100.2:554/ch01.264' }
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

## D. Issues and bugs

Should you encounter any issues or bugs, please report to me via imamkhaira (at) gmail (dot) com.

[hls]: https://github.com/video-dev/hls.js/
[vjs]: https://videojs.com/
[vlc]: https://www.videolan.org/
