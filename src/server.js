const express = require('express');
const server = express();
server.use(express.static('/public'));

const FilePath = __dirname + '/views/'

server.get('/', (req,res) => res.sendFile(FilePath + "index.html"));
server.get('/job', (req,res) => res.sendFile(FilePath + "job.html"));
server.get('/job/edit', (req,res) => res.sendFile(FilePath + "job-edit.html"));
server.get('/profile', (req,res) => res.sendFile(FilePath + "profile.html"));


server.listen(3000, () => console.log('Server listening on port'));