#!/bin/bash
# (c) 2022 imamkhaira
# use this code

# starts a transcoder that listen to port 3000
docker run --name transcoder -d -p 3000:80 -v /dev/shm:/tmp imamkhaira/rtsp-to-hls:latest
