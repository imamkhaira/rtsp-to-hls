#!/bin/bash

# test-ffmpeg.sh
# test various flags used by ffmpeg and output to TEMP_DIR
# refer: https://github.com/riltech/streamer/blob/007ca6caa68b3da05e91d26091e6e53df2672ed4/process.go#L34

# where is the test directory? in Linux, it'd be /dev/shm.
# in other OS, change it as apropriate.
TEMP_DIR="/dev/shm/11"

# a full rtsp URL as test.
TEST_RTSP="rtsp://admin:Xtend123456@192.168.100.125/ch01.264"
# TEST_RTSP="rtsp://admin:12345678@192.168.100.123:554/ch03.264"

# clean the temp dir
rm -f "$TEMP_DIR/*" 

# start ffmpeg transcoding process.
ffmpeg \
  -y \
  -fflags \
  nobuffer \
  -rtsp_transport \
  tcp \
  -i \
  "$TEST_RTSP" \
  -f \
  lavfi \
  -i \
  "anullsrc=channel_layout=stereo:sample_rate=44100" \
  -vsync \
	0 \
  -copyts \
  -vcodec \
  copy \
  -movflags \
  frag_keyframe+empty_moov \
  -an \
  -hls_flags \
  delete_segments+append_list \
  -f \
  hls \
  -segment_list_flags \
  live \
  -hls_time \
  0.5 \
  -hls_list_size \
  6 \
  -hls_segment_filename \
  "$TEMP_DIR/%d.ts" \
  "$TEMP_DIR/index.m3u8"

# you can then setup a web server and point it to serve files from the $TEMP_DIR.
