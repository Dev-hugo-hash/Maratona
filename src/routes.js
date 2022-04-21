const express = require('express');
const routes = express.Router()

const Profile = {
    
    data: {

        "name": 'Vitor Hugo ',
        "avatar": 'https://avatars.githubusercontent.com/u/80496528?v=4',
        "monthly-budget": "R$3.000",
        "hours-per-day" : 5,
        "days-per-week": 5,
        "vacation-per-year": 2,
        "value-hour": 75

    },

    controllers :{

        index(req, res){

           return res.render(filePath + "profile", {profile: Profile.data})

        },
        update(req,res){
            //req.body para pegar os dados
            const data = req.body;

            //definir semanas ao ano: 52

            const weeksPerYear = 52;

            //remover as semanas de ferias do ano, para pegar quantas semanas tem em um mes
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;//Quantas semanas estou trabalhando no mes 

            //horas trabalhadas na semana
            const weeksTotalHours = data["hours-per-day"] * data["days-per-week"];

            //horas por mes
            const monthlyTotalHours = weeksTotalHours * weeksPerMonth;
            
            //total de horas trabalhadas no mes
            const valueHour  = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour

            }
            return res.redirect('/profile')
        }

    }
}

const Job = {

    data: [ 

        {
            id:1,
            name: "Pizzaria Grego",
            "daily-hours": 2,
            "total-hours": 1,   
            created_at: Date.now()
        },
        {
            id:2,
            name: "One Two Project",
            "daily-hours": 3,
            "total-hours": 47,   
            created_at: Date.now()
        },

    ],

    //Controle do Job
    controllers: {

        index(req, res) {

            //ajustes no job
            //calculo de tempo restante
            const updatedJobs = Job.data.map((job) => {
            
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'Done' : 'Progress'
            
                return {
                        
                    ...job, //espalhamento
                   remaining,
                    status,
                    budget: Profile.data["value-hour"] * job["total-hours"] //calculo de hora
            
                }
            })
            
            
            return res.render(filePath + "index", {profile: Profile.data, jobs: updatedJobs })
            
        },
        create(req, res){

           res.render(filePath + "job")

        },
        save(req, res){

            const lastId = Job.data[Job.data.length - 1]?.id || 1;

            Job.data.push({

                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],   
                created_at: Date.now()

            });

            return res.redirect('/')
        },

    },

    //funções auxiliares
    services: {

        remainingDays(job){

            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
        
            const createdDate = new Date(job.created_at)//Dia que o job foi criado 
            const dueDay = createdDate.getDate() + Number(remainingDays) //Dia da entrega 
            const dueDate = createdDate.setDate(dueDay)//Data exata do vencimento
        
            const timeDiffInMs = dueDate - Date.now() //Diferença de dias 
                //Transformar Milli em dias
            const dayInMs = 1000 * 60 * 60 * 24
               const dayDiff = Math.floor(timeDiffInMs / dayInMs)//diferenca em dias arredonada para baixo
        
            return dayDiff;
        },

    },

}

const filePath = __dirname + '/views/'

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/edit', (req,res) => res.render(filePath + "job-edit"));
routes.get('/profile', Profile.controllers.index );
routes.post('/profile', Profile.controllers.update);

module.exports = routes;