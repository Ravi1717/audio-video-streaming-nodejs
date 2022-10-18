const {createServer} = require('http');
const server = require('http').createServer();
const {stat, createReadStream} = require('fs');
const {promisify} = require('util');
const fileName = './samplevideo.mp4';
const fileInfo = promisify(stat);
const fs = require('fs')


server.on('req',async(req,res)=>{
    const range = req.headers.range;
    console.log('range bound', range);
    
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
}).listen(5000, ()=>{
    console.log('Server running in port - 5000')
})