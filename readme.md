#This Project is for replacing third party app VoCollect used in #Distribution Centres.

#technologies Used :

#1. For Making android app cordova is used (Inside Folder DCVoice)
	Various Plugins used are :
		- Bluetooth SE Plugin for turning on Bluetooth, Discovering Bluetooth Devices and Connecting to them.
		- Media Plugin for audio recording.
		- File Transfer Plugin for making HTTP POST request to server for uploading the file.
		- TTS(Text To Speech) Plugin

#2. Server Side scripting is done using node.js (Inside Sever Folder)
	Contains Files folder which holds all necessary things required.	
		- speech.py (python script) file for converting speech to text using google api
		- file.wav which is actually uploaded to server (not actually wav ... it is converted to correct wav format (song.wav) using bash command)
		- song.wav actual wav file which is consumed by speech.py to convert it into text
		- Output.txt is file which is text format of speech
		- For now speech_rec.sh is not being used 