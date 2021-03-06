
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
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '/Users/a0m0195/Project/Server/Files');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname+'.aac');
  }
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
    var task1 = exec('echo "y" | ffmpeg -i Files/file.aac -ar 16000 -ac 1 -c:v libx264 Files/song.wav', function (error, stdout, stderr) {

      //---------------------|| Nested for sequential Execution ||---------------------//
      var task2 = exec('python Files/speech.py', function (error, stdout, stderr) {

        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);

        //--------------------|| Execute if no Error Found ||---------------------//

        if (error === null) {
          

            var filePath = path.join(__dirname, '/Files/Output.txt');



            var stat = fileSystem.statSync(filePath);
            // To check if filepath exists

            res.writeHead(200, {
              'Content-Type': 'text/txt',
              'Content-Length': stat.size,
              'Content-Disposition': 'attachment; filename=say'
            });

            var readStream = fileSystem.createReadStream(filePath);
            // We replaced all the event handlers with a simple call to readStream.pipe()
            readStream.on('open', function () {
              console.log(stat.size);
              // This just pipes the read stream to the response object (which goes to the client)
              readStream.pipe(res);
            },function(err) {
              res.end("File is uploaded");
            });


        }

      });


    });

  });
});

// To start server using express method listen on port 8000
app.listen(8000,function(){
  console.log("Working on port 8000");
});