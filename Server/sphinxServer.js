
var express =   require("express");
// Express to handle routing, Basically handling http requests like GET , POST etc
// https://expressjs.com/ for more details

var multer  =   require('multer');
// Multer is a nodejs middleware used for file uploading , processing HTTP multipart requests

var app = express();
// Instance of express 

var fileSystem = require("fs");
var path = require('path');
var exec = require('child_process').exec;

var password = "jtfjhtf";

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
   //console.log(req);
   //console.log(req.query.params);
   //console.log(typeof(req.query.params));
   var t = JSON.parse(req.query.params);
   console.log(t.value);
   if(t.value === "100")
      {password = "ONE ZERO ZERO";
  }
    else if(t.value === "101") {
      password = "ONE ZERO ONE";
    }
    else if(t.value === "102") {
      password = "ONE ZERO TWO";
    }
    else if(t.value === "103" ){
      password = "ONE ZERO THREE";
    }
   console.log(password);
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

      //---------------------|| Nested for sequential Execution ||---------------------//
      // var task2 = exec('python Files/speech.py', function (error, stdout, stderr) {

      //   // console.log('stdout: ' + stdout);
      //   // console.log('stderr: ' + stderr);

      //   //--------------------|| Execute if no Error Found ||---------------------//

      //   if (error === null) {
          

      //       var filePath = path.join(__dirname, '/Files/Output.txt');



      //       var stat = fileSystem.statSync(filePath);
      //       // To check if filepath exists

      //       res.writeHead(200, {
      //         'Content-Type': 'text/txt',
      //         'Content-Length': stat.size,
      //         'Content-Disposition': 'attachment; filename=say'
      //       });

      //       var readStream = fileSystem.createReadStream(filePath);
      //       // We replaced all the event handlers with a simple call to readStream.pipe()
      //       readStream.on('open', function () {
      //         console.log(stat.size);
      //         // This just pipes the read stream to the response object (which goes to the client)
      //         readStream.pipe(res);
      //       },function(err) {
      //         res.end("File is uploaded");
      //       });


      //   }

      // });
                      //-------- bash command to remove silences part from an audio file--------//
       var task3 = exec('ffmpeg -i Files/song.wav -af silenceremove=0:0:0:-1:1:-40dB -ac 1 Files/final.wav -y',function(error , stdout , stderr) {    

                      //----------- bash command to perform speech to text using our model -----------------//
          var task2 = exec('pocketsphinx_continuous  -dict /Users/a0m0195/FinalModel/etc/FinalModel.dic -hmm /Users/a0m0195/FinalModel/model_parameters/FinalModel.ci_cont -jsgf /Users/a0m0195/pocketsphinx/etc/DC.jsgf -infile /Users/a0m0195/Project/Server/Files/final.wav > /Users/a0m0195/Project/Server/Files/input.txt',function(err , stdout , stderr) {

          


            if(err === null) {
              fileSystem.readFile(__dirname + "/Files/input.txt" , 'utf8',function(oerr , txt) {

                  var str = "";
                  if(txt === ""){
                    str = "";
                  }

                  else if(txt === "START\n"){
                    str = "Please say Password";
                  }
                  // else if(txt === "ZERO ONE TWO\n") {
                  //   str = "Please say Password";
                  // }
                  else if(txt === password + "\n") {
                    str = "Successfully Logged in .. To hear subcentre choices please say subcenter";
                  }
                  else if(txt === "SUBCENTER\n") {
                    str = "Subcenter choices are : 196 ... 214 ... 507 , Please respond with subcenter number";
                  }
                  else if(txt === "ONE NINE SIX\n" || txt === "TWO ONE FOUR\n" || txt === "FIVE ZERO SEVEN\n") {
                    str = "Respond with three digit work area";
                  }
                  else if(txt === "FOUR FOUR ZERO\n") {
                    str = "To begin Picking say Ready";
                  }
                  else if(txt === "READY\n") {
                    str = "Use the pallet jack present at module 564 ...... This is a pick to container trip ... Proceed to module 564 ... slot 123 ..... Say last 3 digit of item UPC";
                  }
                  else if(txt === "THREE FIVE SIX\n") {
                    str = "Pick 3";
                  } 
                  else if(txt === "THREE\n" || txt === "THREE\n\n") {
                    str = "Proceed to slot 124 and Pick 4";
                  }
                  else if(txt === "FOUR\n" || txt === "FOUR\n\n") {
                    str = "Proceed to slot 125 and Pick 5";
                  }
                  else if(txt === "TWO\n" || txt === "TWO\n\n") {
                    str = "3 Short ...Proceed to slot 126 and Pick 6";
                  }
                  else if(txt === "SIX\n" || txt === "SIX\n\n") {
                    str = "You have completed the trip, are there any corrections?"
                  }
                  else if(txt === "NO\n") {
                    str = "Trip Complete.... Chase trip created";
                  }
                  else if(txt == "YES\n") {
                    str = "To hear subcentre choices please say subcenter";
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

// To start server using express method listen on port 8000
app.listen(8000,function(){
  console.log("Working on port 8000");
});