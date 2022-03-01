const express = require('express');
const server = express();
const routes = require('./routes')

//Pasta estática 
server.use(express.static('public'));

//EJS
server.set('view engine', 'ejs');

server.use(express.urlencoded({extended: true}))

//routes
server.use(routes);


//Escutando a porta 
server.listen(3000, () => console.log('Server listening on port'));