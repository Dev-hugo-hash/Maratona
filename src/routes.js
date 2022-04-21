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
    {
        id:1,
        name: "Pizzaria Grego",
        "daily-hours": 2,
        "total-hours": 60,   
        created_at: Date.now()
    },
    {
        id:2,
        name: "One Two Project",
        "daily-hours": 3,
        "total-hours": 47,   
        created_at: Date.now()
    }
]

const filePath = __dirname + '/views/'

routes.get('/', (req,res) => res.render(filePath + "index", {profile: profile, jobs }));
routes.get('/job', (req,res) => res.render(filePath + "job"));
routes.post('/job', (req,res) => {


    const lastId = jobs[jobs.length - 1]?.id || 1;

    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],   
        created_at: Date.now()
    });

    return res.redirect('/')

});
routes.get('/job/edit', (req,res) => res.render(filePath + "job-edit"));
routes.get('/profile', (req,res) => res.render(filePath + "profile", {profile: profile}));

module.exports = routes;