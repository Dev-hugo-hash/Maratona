const express = require('express');
const server = express();
server.use(express.static('/public'));

const FilePath = __dirname + '/views/'

server.get('/', (req,res) => {

    res.sendFile(FilePath + "index.html");

})


server.listen(3000, () => console.log('Server listening on port'));