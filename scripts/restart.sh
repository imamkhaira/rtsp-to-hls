#!/bin/bash

echo "stopping transcoder"
sudo docker kill transcoder

echo "starting transcoder again"
sudo docker start transcoder

echo "complete"
