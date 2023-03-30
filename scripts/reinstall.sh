#!/bin/bash

# start transcoder
sudo docker kill transcoder
sudo docker rm transcoder
sudo docker run -d --name transcoder -p 3000:80 -v /dev/shm:/tmp imamkhaira/rtsp-to-hls

