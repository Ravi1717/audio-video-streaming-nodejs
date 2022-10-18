const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get('/test', function(req, res){
    res.send('Hello from express js app.')
})

app.get('/video', function(req, res){
    console.log("Hello world from video")
    const range = req.headers.range;
    console.log('range bound', range);
    if(!range){
        res.status(400).send('Requires range header.')
    }
    const videoPath = 'samplevideo.mp4';
    const videoSize = fs.statSync('samplevideo.mp4').size;
    const CHUNK_SIZE = 10**6;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start +1;

    const headers = {
        "Content-Range": `bytes ${start} - ${end} / ${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"video/mp4"
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, {start, end});

    videoStream.pipe(res);
})

app.get('/audio', function(req, res){
    const range = req.headers.range;
    const audioPath = 'sampleaudio.mp3';
    const audioSize = fs.statSync('sampleaudio.mp3').size;
    const CHUNK_SIZE = 10**6;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, audioSize - 1);

    const contentLength = end - start +1;

    const headers = {
        "Content-Range": `bytes ${start} - ${end} / ${audioSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"audio/mp3"
    };

    res.writeHead(206, headers);

    const audioStream = fs.createReadStream(audioPath, {start, end});

    audioStream.pipe(res);
});

app.listen(8000, function(){
    console.log('Listening on Port 8000!')
})