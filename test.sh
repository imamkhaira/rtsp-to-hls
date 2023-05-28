#!/bin/bash

RTSP="rtsp://admin:123456@fsl205.trex-cod.ts.net:554/serial=cHjtGeHizT5AR07oFEbv000000&ch=1&stream=0&standard=1"
TEMP="/Volumes/tmp"
LOGS_FLAGS="-nostats -hide_banner -loglevel error"

ffmpeg -fflags nobuffer \
 -rtsp_transport tcp \
 -analyzeduration 10000000 \
 -probesize 10000000 \
 -use_wallclock_as_timestamps 1 \
 -fpsprobesize 50 \
 -i "$RTSP" \
 -fps_mode cfr \
 -r 30 \
 -c:v copy \
 -c:a copy \
 -movflags frag_keyframe+empty_moov \
 -hls_flags delete_segments+append_list \
 -f segment \
 -segment_list_flags live \
 -segment_wrap 5 \
 -segment_time 0.5 \
 -segment_list_size 5 \
 -segment_format mpegts \
 -segment_list "$TEMP/index.m3u8" \
 -segment_list_type m3u8 \
 "$TEMP/%d.ts"


# https://medium.com/androvideo/convert-rtsp-to-hls-using-ffmpeg-2fe2cdf3a0de
# ffmpeg -fflags nobuffer \
#  -rtsp_transport tcp \
#  -analyzeduration 1000 \
#  -use_wallclock_as_timestamps 1 \
#  -i "$RTSP" \
#  -c:v copy \
#  -c:a copy \
#  -movflags frag_keyframe+empty_moov \
#  -hls_flags delete_segments+append_list \
#  -f segment \
#  -reset_timestamps 1 \
#  -segment_list_flags live \
#  -segment_wrap 10 \
#  -segment_time 0.5 \
#  -segment_list_size 10 \
#  -segment_format mpegts \
#  -segment_list "$TEMP/index.m3u8" \
#  -segment_list_type m3u8 \
#  "$TEMP/%d.ts"

# https://medium.com/@tom.humph/saving-rtsp-camera-streams-with-ffmpeg-baab7e80d767
# ffmpeg -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i "$RTSP" -vcodec copy -acodec copy -f segment -reset_timestamps 1 -segment_time 900 -segment_format mkv -segment_atclocktime 1 -strftime 1 "%Y%m%dT%H%M%S.mkv"

# -an removes audio.