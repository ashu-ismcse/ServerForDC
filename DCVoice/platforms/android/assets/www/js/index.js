/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
 

                                        
//---------------------------||Function to turn on Bluetooth on device||-------------------------------//Begin
var doc = document.getElementById("TurnOnBluetooth");
doc.onclick = function() {
                    bluetoothSerial.enable(function() {
                    alert("Bluetooth is enabled");
                    },function() {
                      console.log("The user did *not* enable Bluetooth");
                    });
                };

//---------------------------||Function to turn on Bluetooth on device||-------------------------------//End
                                       

//-----------||Function to discover devices and print on screen using radio buttons||------------------//Begin

var count = 1;

document.getElementById("DiscoverDevices").onclick = function() {
                    
bluetoothSerial.discoverUnpaired(function(devices) {
    devices.forEach(function(device){
        var documen = document.getElementById('AllDevices');
        var br = document.createElement('br');

        var radioB = document.createElement('input');
        radioB.type = 'radio';
        radioB.id = 'radB'+ count;
        count++;
        radioB.name = 'hello';

        var label = document.createElement('label');
        label.textContent = device.name;
        label.htmlFor = radioB.id;
        label.id = device.address;
        documen.appendChild(label);
        label.appendChild(radioB);
        documen.appendChild(br);
})}, function(){
    alert("error")
});
};

//-----------||Function to discover devices and print on screen using radio buttons||------------------//End
                                          

//-------------------------||Function to pair and connect with devices||-------------------------------//Begin

function connectSuccess(a){
        alert("Connection Successful");
    }

function connectFailure(a) {
    alert();
}

function selected() {
    var radios = document.querySelectorAll('input[type=radio]');
    for(var i = 0 ; i < radios.length ; i++) {
        if(radios[i].checked) {
            var id = radios[i].id;
            var lab = document.querySelector('label[for='+id+']');
            alert('Connecting to ' + lab.textContent);
            bluetoothSerial.connect(lab.id , connectSuccess, connectFailure);
        }
    }
}


var buttons = document.querySelector('div .selected');
buttons.addEventListener('click' , selected);

//-------------------------||Function to pair and connect with devices||-------------------------------//End



/// 

//---(recordAudio) Function to start and stop recording on device and (sendserver Function) after sometime send it to the server---//Begin

var stop = 0;

function recordAndSend() {
        //---------------- record audio function -------------//Begin
        
        // Source where file recorded will be saved 
        if(stop){
           return; 
        }
        var src = "myrec.wav";

        // new media object mediaRec
        var mediaRec = new Media(src,
            // success callback
            function() {
                //alert("recordAudio():Audio Success");
            },

            // error callback
            function(err) {
                alert("recordAudio():Audio Error: "+ err.code);
            }
        );

        // Record audio
        mediaRec.startRecord();

        // Stop recording after 3 seconds
        setTimeout(function() {
            mediaRec.stopRecord();mediaRec.release(); 
        }, 3000);

    //----------------- record audio function ----------// End


    //----------------- send to server function -----------// Begin
   
        function sendserver() {
        var fileURL = "/storage/emulated/0/myrec.wav"
        var ur = "http://192.168.43.112:8000/";
        //var uri = encodeURI("http://posttestserver.com/post.php");
        var options = new FileUploadOptions();
        
        options.fileKey = "file";
        options.fileName = "file";
        options.mimeType = "audio/m4a";
        options.httpMethod = "POST";
        options.chunkedMode = false;

        var headers = {'headerParam':'headerValue','Connection':'close'};
        options.headers = headers;
        

        var ft = new FileTransfer();

        ft.upload(fileURL, ur, onSuccess, onError, options);

        function onSuccess(r) {
            // alert("Code = " + r.responseCode);
            // alert("Response = " + r.response);

            //----------|| Text to speech of response from server ||--------// Begin
            TTS.speak({
                text: r.response,
                locale: 'en-US',
                rate: 1.5
            }, function (success) {
                     // Do Something after success
                     // You will hear a voice 
                    // alert(r.response);
                     var bye = r.response.toString();
                    //  alert(bye);
                     if(bye === "bye") {
                         return;
                     }
                     else {
                         setTimeout(recordAndSend , 500);
                     }
            }, function (reason) {
                     // Handle the error case
                    alert(reason);
            });


            //----------|| Text to speech of response from server ||--------// End

            //---------------|| Toast to confirm on success ||---------------// Begin
            window.plugins.toast.showWithOptions({
                message: "File Sent",
                duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                position: "bottom",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });

            
            //---------------|| Toast to confirm on success ||---------------// End
            
        }

        function onError(error) {
            alert("An error has occurred: Code = " + error.code);
            alert("upload error source " + error.source);
            alert("upload error target " + error.target);
        }
    
    }

    setTimeout(function() {
            sendserver(); 
        }, 4000);

    //----------------- send to server function -----------// End   

}

//---(recordAudio) Function to start and stop recording on device and (sendserver Function) after sometime send it to the server---//Begin


//------------------||Function to start audio recording and stop||------------------//Begin

var startButton = document.querySelector('div .start');
startButton.addEventListener('click', startFun);

var stopButton = document.querySelector('div .stop');
stopButton.addEventListener('click', stopFun);

//------------------||Function to start audio recording and stop||------------------//End


function startFun() {
    stop = 0;
    recordAndSend();
}

function stopFun() {
    stop = 1;
}