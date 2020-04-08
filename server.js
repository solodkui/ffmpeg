const express    = require('express'),
      ffmpeg     = require('fluent-ffmpeg'),
      fileUpload = require('express-fileupload'),

      app = express(),

      port = 5000;

// Configure Middleware

// Configure Fileupload moddleware

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// configuring the  ffmpeg library

ffmpeg.setFfmpegPath(__dirname + '/ffmpeg/ffmpeg.exe')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/mp4toavi', (req, res) => {
  res.contentType('video/avi');
  res.attachment('output.avi');

  // Uploaded File
  req.files.mp4.mv('tmp/' + req.files.mp4.name, function(err) {
    if(err) return res.sendStatus(500).send(err);
    console.log('File uploaded successfully');
  })

  // Converting mp4 to avi & Other
  ffmpeg('tmp/' + req.files.mp4.name)
    .toFormat('avi')
    .seek('0:10')
    .size('640x400')
    .duration(10)
    .on('end', function() {
      console.log('Done !');
    })
    .on('error', function(error) {
      console.log('An error ocurred' + error.message);
    })
    .pipe(res, {end: true})
});

app.listen(port, () => {
  console.log('Server is listening on: ' + port);
});