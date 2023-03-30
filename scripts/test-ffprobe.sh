#!/bin/bash

# test-ffmpeg.sh
# use ffprobe to check stream codec
# refer: https://gist.github.com/sudheer-k-bhat/b1e3ab1fb75c1b9d3f05

# a full rtsp URL as test.
TEST_RTSP="rtsp://admin:Xtend123456@192.168.100.135/ch01.264"
# TEST_RTSP="rtsp://admin:12345678@192.168.100.123:554/ch03.264"

# ffprobe -v quiet -print_format json -select_streams v:0 "$TEST_RTSP"
ffprobe -v quiet -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "$TEST_RTSP"

# rtsp://192.168.100.123:554/ch01.264
link/ether 30:de:4b:32:b3:d9 brd ff:ff:ff:ff:ff:ff
inet6 fe80::32de:4bff:fe32:b3d9/64 scope link