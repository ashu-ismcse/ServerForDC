# Server Side

This Folder contains all the files which are on server side (No direct relation with Cordova folder)

## server.js
```
This is a node.js file which :
	- creates server using express framework 
	- Handle file uploading using multer middleware 
	- Executes bash commands for conversion of recieved sound file(file.wav) to correct wav file (song.wav)
		(The file recieved from android device is not correct wav format thats' why this conversion is needed)
	- Executes python script for speech recognition 

```

## sphinxServer.js
```
This uses PocketSphinx for speech recognition unlike server.js which uses Google api for speech recognition.
```

## Files Folder 
	
``` 
This folder contains python script and all temporary files
```