#!/bin/sh

echo "y" | 
ffmpeg -i file.wav -acodec pcm_u8 -ar 22050 song.wav
sleep 1s

python speech.py