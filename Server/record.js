
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

// diskStorage is multer method to full control on storing files to disk
var i = 1;
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '/Users/a0m0195/newwav/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldName+ '.aac');
  }
  i++;
});

var upload = multer({ storage : storage}).single('file');
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

    //-----------------|| Execute bash commands || -----------------//
    var task1 = exec('ffmpeg -i newwav/file.wav -ar 16000 -ac 1 newwav/q.wav -y', function (error, stdout, stderr) {

      });


    });

  });

// To start server using express method listen on port 8000
app.listen(8000,function(){
  console.log("Working on port 8000");
});