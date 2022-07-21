# TL;DR

How to deploy transcoder:

1. Download and install Docker into the server. Make sure that the server has working internet connection.
2. Open the server's command line interface.
3. Deploy the transcoder by running the following command:

```sh
  docker run --name transcoder -d -p 80:80 -v /dev/shm:/tmp:delegated imamkhaira/rtsp-to-hls:latest
```

4. Configure nginx to proxy /transcode request to the server's listening port (see point D).

For a more complete configuration, please follow these steps below.

# Project Goal

This aims to make a software to convert a RTSP stream from china CCTV to modern HLS stream.
request can be made via API calls and it includes automatic shutdown of unused streams.

# Installation

This package offers two way to run, either by using Docker or bare-metal.

## Using the Docker image

Use below steps if you'd like to use Docker.

For quick testing or deployment, just run this image using Docker with following command:

```sh
# no ramdisk mounting (use this if you unsure)
docker run --name transcoder -d -p 80:80 imamkhaira/rtsp-to-hls:latest
# with delegated ramdisk mounting
docker run --name transcoder -d -p 80:80 -v /dev/shm:/tmp:delegated imamkhaira/rtsp-to-hls:latest

```

Note:

-   The transcoder is listening on port 80 in the container.
-   If your server have enough memory, you can improve performance by mounting the host' ramdisk.
    into the container's `/tmp`. In ubuntu, the ramdisk is located at `/dev/shm` .
    By doing this, the container's temporary files will be put in RAM instead of making large writes in the disk.
    Thus, this will greatly reduce disk I/O and improves overall performance.
-   please read your operating system's documentation regarding the location of ramdisk or how to make one.
-   read more on performance in section D below

## Running from source code

If you have a really powerful hardware, or you just hate Docker ([like BSD dudes]), you can just follow steps below.

1. Install `ffmpeg` command-line utility. Go to https://ffmpeg.org/download.html and follow instructions.
2. Copy `.env.example` to `.env`
3. Make changes according to your needs.
   IMPORTANT! make sure the `RUNAS_UID` is correct, and `WORK_DIRECTORY` is an EMPTY folder!
4. Install dependencies by running `npm install`
5. If OK, run for production by running `npm run deploy:start`
6. Start transcoding by making HTTP `POST` request as described in section C below

you can stop the transcoder by `npm run deploy:stop`. Or, view the proces by `npm run deploy:status`

Also, please read more on performance in section D below.

# Using the Transcoder

## Create Transcoder task

Once the transcoder is up and running, you can start transcoding by sending HTTP POST request into `http://<your ip>:<PORT>/transcode` with the following body:

```json
{ "url": "<your cctv's rtsp url>" }
```

**Note: You MUST make sure that the request' `Content-Type` header is set to `application/json`.**

The transcoder will then process the stream (takes up to 30 s) and replied with following response format:

```json
{
  "error" : true | false,
  "stream" : "http://<your ip>:<PORT>/output/<unique stream ID>"
}
```

Below is the example if how to send request using cURL

```sh
 # CAPITALIZED words are variables inside .env
 curl --location --request POST 'http://<your ip>:<PORT>/transcode' \
 --header 'Content-Type: application/json' \
 --data-raw '{ "url": "rtsp://<your cctv url>" }'

 # Sample response:
 # {"error":false,"stream":"http://<your ip>:<PORT>/output/<stream id>/index.m3u8"}
```

## Testing transcoded stream

you can then play the `stream` part of the response in the browser using either:

-   [HLS.js][hls]
-   [Video.js][vjs]

or if you just wanted to check, simply paste the `stream` into:

-   [VLC][vlc]
-   QuickTime Player.

## Sample code

below is a sample of Typescript code:

```ts
interface TranscoderResponse {
    error: boolean;
    stream: string;
}

async function start(): Promise<void> {
    try {
        this.isLoading = true;
        // if error is true, then stream is null.
        // stream is a string containing absolute path to
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

# Proxying to the Internet

When using the Transcoder via reverse proxy, you need to forward two headers from the proxy to the transcoder:

-   `Host`: set this to the listening domain name, and port.
    The port can be unset if it is either 80 or 443.
    If not set, it will default to container name or `localhost`.
-   `X-Forwarded-Proto` set this to the listening protocol (http/https).
    If not set, it will default to `http`

This is necessary so that the transcoder response has the correct stream url (ex: `https://your_domain.com/output/12345/index.m3u8`).
otherwise, it will fallback to localhost (ex: `http://localhost/output/12345/index.m3u8`)

Below is a sample of working Nginx configuration:

```nginx
server {
    listen 8080 ssl;
    listen [::]:8080 ssl;
    server_name transcoder.batmen.cc;

    # include snippets/ssl.conf;
    error_log /var/log/nginx/transcoder.error.log;
    access_log /var/log/nginx/transcoder.access.log;

    location / {
        proxy_pass_request_headers on;

        # transcoder is listening on port 3000
        proxy_pass http://localhost:3000;

        proxy_set_header Host $host:$server_port;
        # or: proxy_set_header Host transcoder.batmen.cc:8080;

        proxy_set_header X-Forwarded-Proto $scheme;
        # or: proxy_set_header X-Forwarded-Proto https;
    }

}
```

> Help needed! Please help us to add sample config for other web servers!

# Performance Optimization

Please bear in mind that the performance bottleneck of this software is limited by ffmpeg.

### Optimizing I/O performance.

When a transcode process is running, `ffmpeg` creates a lot of small video files, called `segments`,
that will be listed in an `index.m3u8` file. a HLS video player will then download the segments as the time progresses.
Each transcode process can create up to 240 segments that will be cleaned up when no one is watching the steams.

Therefore, it is very good if you can make use of your free RAM as temporary storage to store these segments.
If you're using Docker, you can mount the ramdisk as a delegated volume mount.

`docker run --name transcoder -d -p 80:80 -v /dev/shm:/tmp:delegated imamkhaira/rtsp-to-hls:latest`

Read more about delegation at https://docker-docs.netlify.app/docker-for-mac/osxfs-caching/#examples

But if you are running from source code/bare-metal, you need to edit the `.env` file,
and update the value of `WORK_DIRECTORY` to the location of your ramdisk.

### Optimizing Encode/Decode performance

You can try setting up an optimized version of FFMPEG that is compiled specifically for your GPU.

> > This is only achievable if you are running on bare-metal with sufficiently powerful GPU.

-   If you are using NVIDIA [(still deserve the 🖕🏻)], please read:
    https://docs.nvidia.com/video-technologies/video-codec-sdk/ffmpeg-with-nvidia-gpu/
-   Other GPU manufacturer, please read https://trac.ffmpeg.org/wiki/HWAccelIntro

### Network Consideration

The video stream can be very bandwidth-consuming, especially if you transcode multiple streams simultaneously.
Therefore, it is best to run the transcoder in a server with a gigabit adapter.

## Issues and bugs

Should you encounter any issues or bugs, please [open a ticket here].
if you got special needs and wanted futher discussion, please email me to 1331247 at duck.com

[hls]: https://github.com/video-dev/hls.js/
[vjs]: https://videojs.com/
[vlc]: https://www.videolan.org/
[open a ticket here]: https://github.com/imamkhaira/rtsp-to-hls/issues
[(still deserve the 🖕🏻)]: https://www.reddit.com/r/linux/comments/vbvxiv/10_years_ago_today_linus_torvalds_to_nvidia_fu_you/
[like bsd dudes]: https://www.reddit.com/r/BSD/comments/r32fbi/eli5_why_does_the_freebsd_community_hate_docker/
