
var express =   require("express");
// Express to handle routing, Basically handling http requests like GET , POST etc
// https://expressjs.com/ for more details

var multer  =   require('multer');
// Multer is a nodejs middleware used for file uploading , processing HTTP multipart requests

// state for maintaing state so that user cannot go back of forward without completing current task
state = 1;


var app = express();
// Instance of express 

var fileSystem = require("fs");
var path = require('path');
var exec = require('child_process').exec;

var password = "ashutosh";
// password set randomly

// diskStorage is multer method to full control on storing files to disk
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '/Users/a0m0195/Project/Server/Files');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname+'.wav');
  }
});

var upload = multer({ storage : storage}).single('file');

app.get('/',function(req,res) {

   	var t = JSON.parse(req.query.params);
   	console.log(t.value);
   	password = "ONE ZERO ZERO";
      // Password set after getting a GET request without pressing the operator you cannot proceed
   	console.log("Password : " + password);
});

// Instance of multer (Multer Object) with options storage 
// .single('file') => accepts a single file for uploading with fieldName as file

app.post('/',function(req,res){ 
  // Function => Route Handler can be a single function or an array of function 
  // (Middleware function) => access to both req and res

  // --- '/' -> path to which middleware function applies



  //--------------||File uploading Function||----------------//

  upload(req,res,function(err) {
    if(err) {
      console.log(err)
      return res.end("Error uploading file.");
    }

    //-----------------|| Execute bash commands to convert sound file to 16000 sampling rate and mono channel with 256k bit rate|| -----------------//
    var task1 = exec('ffmpeg -i Files/file.wav -ar 16000 -ac 1 Files/song.wav -y', function (error, stdout, stderr) {

                     //-------- bash command to remove noise part from an audio file--------//
      var task2 = exec('ffmpeg -i Files/song.wav -af "highpass=f=300, lowpass=f=3000" Files/tsong.wav -y',function(error , stdout , stderr) {

      				//-------- bash command to remove silences part from an audio file--------//
       var task3 = exec('ffmpeg -i Files/tsong.wav -af silenceremove=0:0:0:-1:1:-40dB -ac 1 Files/final.wav -y',function(error , stdout , stderr) {   

                      //----------- bash command to perform speech to text using our model -----------------//
                      // -dict for dictionary ".dic" // -hmm for model prepared after training // -jsgf for grammar 
          var task4 = exec('pocketsphinx_continuous  -dict /Users/a0m0195/FinalModel/etc/FinalModel.dic -hmm /Users/a0m0195/FinalModel/model_parameters/FinalModel.ci_cont -jsgf /Users/a0m0195/FinalModel/etc/DC.jsgf -infile /Users/a0m0195/Project/Server/Files/final.wav > /Users/a0m0195/Project/Server/Files/input.txt',function(err , stdout , stderr) {

              

          	// If there is no error then proceed
            if(err === null) {
              fileSystem.readFile(__dirname + "/Files/input.txt" , 'utf8',function(oerr , txt) {

                  var str = "";
                  if(txt === ""){
                    str = "";
                  }

                  

                  else if(txt === "START\n" && state === 1){
                    str = "Please say Password";
                    state = 2;
                  }
                  
                  else if(txt === password + "\n" && state === 2) {
                    str = "Successfully Logged in .. To hear subcentre choices please say subcenter";
                    state = 3;
                  }
                  else if(txt === "SUBCENTER\n" && state === 3) {
                    str = "Subcenter choices are : 196 ... 214 ... 507 , Please respond with subcenter number";
                    state = 4;
                  }
                  else if((txt === "ONE NINE SIX\n" || txt === "TWO ONE FOUR\n" || txt === "FIVE ZERO SEVEN\n") && state === 4) {
                    str = "Respond with three digit work area";
                    state = 5;
                  }
                  else if(txt === "FOUR FOUR ZERO\n" && state === 5) {
                    str = "To begin Picking say Ready";
                    state = 6;
                  }
                  else if(txt === "READY\n" && state === 6) {
                    str = "Use the pallet jack present at module 564 ....Proceed to slot 123 ..... Say last 3 digit of item UPC";
                    state = 7;
                  }
                  
                  else if(txt === "FOUR FIVE SIX\n" && state === 7) {
                    str = "Pick 4";
                    state = 8;
                  }
                  else if((txt === "FOUR\n" || txt === "FOUR\n\n") && state === 8) {
                    str = "Proceed to slot 125 and say last 3 digits of item UPC";
                    state = 9;
                  }
                  else if(txt === "SIX FIVE SIX\n" && state === 9) {
                    str = "pick 5"
                    state = 10;
                  }
                  else if((txt === "TWO\n" || txt === "TWO\n\n") && state === 10) {
                    str = "3 Short ...Proceed to slot 126 and say last 3 digits of item UPC";
                    state = 11;
                  }
                  else if(txt === "SEVEN FIVE SIX\n" && state === 11) {
                    str = "pick 6";
                    state = 12;
                  }
                  else if((txt === "SIX\n" || txt === "SIX\n\n") && state === 12) {
                    str = "You have completed the trip, are there any corrections?"
                    state = 13;
                  }
                  else if(txt === "NO\n" && state === 13) {
                    str = "Trip Complete.... Chase trip created";
                    state = 1;
                  }
                  else if(txt == "YES\n" && state === 13) {
                    str = "To hear subcentre choices please say subcenter";
                    state = 3;
                  }
                  else {
                    str = "Please Repeat";
                  }
                  console.log(txt);

                  fileSystem.writeFile(__dirname + "/Files/Output.txt" , str , function(e){
                    res.sendFile(__dirname + "/Files/Output.txt");
                  });
              });
            }
          });
       });

     });
    });

  });
});

// To start server using express method listen on port 8000
app.listen(8000,function(){
  console.log("Working on port 8000");
});