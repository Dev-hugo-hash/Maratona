const { Router } = require('express');
const routes = Router()

const filePath = __dirname + '/views/'

routes.get('/', (req,res) => res.render(filePath + "index"));
routes.get('/job', (req,res) => res.render(filePath + "job"));
routes.get('/job/edit', (req,res) => res.render(filePath + "job-edit"));
routes.get('/profile', (req,res) => res.render(filePath + "profile"));

module.exports = routes;