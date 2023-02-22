#!/bin/bash

# test-ffmpeg.sh
# use ffprobe to check stream codec
# refer: https://gist.github.com/sudheer-k-bhat/b1e3ab1fb75c1b9d3f05

# where is the test directory? in Linux, it'd be /dev/shm.
# in other OS, change it as apropriate.
TEMP_DIR="/dev/shm/11"

# a full rtsp URL as test.
TEST_RTSP="rtsp://admin:Xtend123456@192.168.100.125/ch01.264"
# TEST_RTSP="rtsp://admin:12345678@192.168.100.123:554/ch03.264"