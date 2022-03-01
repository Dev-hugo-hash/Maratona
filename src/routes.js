const express = require('express');
const routes = express.Router()

const profile = {
    "name": 'Vitor Hugo ',
    "avatar": 'https://avatars.githubusercontent.com/u/80496528?v=4',
    "monthly-budget": "R$3.000",
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 2
}

const jobs = [


]

const filePath = __dirname + '/views/'

routes.get('/', (req,res) => res.render(filePath + "index", {profile: profile}));
routes.get('/job', (req,res) => res.render(filePath + "job"));
routes.post('/job', (req,res) => {

    jobs.push(req.body);

    return res.redirect('/')

});
routes.get('/job/edit', (req,res) => res.render(filePath + "job-edit"));
routes.get('/profile', (req,res) => res.render(filePath + "profile", {profile: profile}));

module.exports = routes;