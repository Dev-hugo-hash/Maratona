const express = require('express');
const server = express();
const routes = require('./routes')

server.use(express.static('public'));
server.set('view engine', 'ejs');
server.use(routes);



server.listen(3000, () => console.log('Server listening on port'));