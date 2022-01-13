const express = require('express');
const server = express();
server.use(express.static('public'));

const filePath = __dirname + '/views/'

server.get('/', (req,res) => res.sendFile(filePath + "index.html"));
server.get('/job', (req,res) => res.sendFile(filePath + "job.html"));
server.get('/job/edit', (req,res) => res.sendFile(filePath + "job-edit.html"));
server.get('/profile', (req,res) => res.sendFile(filePath + "profile.html"));


server.listen(3000, () => console.log('Server listening on port'));