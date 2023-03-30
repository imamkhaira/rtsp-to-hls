#!/bin/bash

# start transcoder
echo "stopping transcoder container"
sudo docker kill transcoder

echo "removing transcoder"
sudo docker rm transcoder


echo "complete. do not forget to remove the image too"