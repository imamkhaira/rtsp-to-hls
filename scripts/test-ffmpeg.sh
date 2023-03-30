#!/bin/bash

# test-ffmpeg.sh - FOR DEVELOPMENT PURPOSE ONLY
# used to test and debug various flags used by ffmpeg and output to $TEMP_DIR
# you can then setup a web server and point it to serve files from the $TEMP_DIR.
# refer: https://github.com/riltech/streamer/blob/007ca6caa68b3da05e91d26091e6e53df2672ed4/process.go#L34
# for FFMPEG, refer: https://gist.github.com/tayvano/6e2d456a9897f55025e25035478a3a50

# why use mpeg2video ?
# 1. it encodes very fast: https://forum.videohelp.com/threads/381532-Which-codec-and-settings-to-use-with-FFmpeg-for-temporary-transcoding#post2468892)
# 2. it is supported by HLS.js: https://github.com/video-dev/hls.js/#features
# 3. can be used with jsmpeg too: https://github.com/k-yle/rtsp-relay/blob/main/index.js
# for h264, see: https://trac.ffmpeg.org/wiki/Encode/H.264

# ------------------------------------------------------

# where is the test directory? in Linux, it'd be /dev/shm.
# in other OS, change it as apropriate.
TEMP_DIR="/dev/shm/11"

# a full rtsp URL as test.
# TEST_RTSP="rtsp://admin:Xtend123456@192.168.100.6/ch0+1.264"
TEST_RTSP="rtsp://admin:Xtend123456@192.168.100.125/ch01.264"
# TEST_RTSP="rtsp://admin:12345678@192.168.100.119:554/ch01.264"

# clean the temp dir
rm -rf "$TEMP_DIR" 
mkdir "$TEMP_DIR"

# -hide_banner \
# -loglevel \
# error \
# -tune zerolatency \
# -s 1280x720 \
# start ffmpeg transcoding process.
ffmpeg \
  -fflags nobuffer \
  -rtsp_transport tcp \
  -i "$TEST_RTSP" \
  -vsync 0 \
  -copyts \
  -c:v h264 \
  -preset ultrafast \
  -b:v 900k \
  -c:a copy \
  -f hls \
  -hls_flags delete_segments+append_list \
  -segment_list_flags live \
  -hls_time 1 \
  -hls_list_size 3 \
  -hls_segment_filename \
  "$TEMP_DIR/%d.ts" \
  "$TEMP_DIR/index.m3u8"
