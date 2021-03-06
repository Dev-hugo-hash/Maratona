const express = require('express');
const routes = express.Router()
const filePath = __dirname + '/views/'

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
            created_at: Date.now(),
   

        },
        {
            id:2,
            name: "One Two Project",
            "daily-hours": 3,
            "total-hours": 47,   
            created_at: Date.now(),
          
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
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
            
                }
            })
            
            
            return res.render(filePath + "index", {profile: Profile.data, jobs: updatedJobs })
            
        },
        create(req, res){

           res.render(filePath + "job")

        },
        save(req, res){

            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({

                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],   
                created_at: Date.now()

            });

            return res.redirect('/')
        },
        show(req, res){
        //retirar job do Data para edita-lo
            
            const jobId = req.params.id

            //para cada funcao se ele encontrar algo vai enviar pra mim 
            const job = Job.data.find(job => Number(job.id) === Number(jobId)) //-> verifica??ao do objeto, se encontrou o id, apresente

            if(!job){

                return res.send("Job not found!")

            }
            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return res.render(filePath + "job-edit", { job })

        },
        update(req, res){

            const jobId = req.params.id

            //para cada funcao se ele encontrar algo vai enviar pra mim 
            const job = Job.data.find(job => Number(job.id) === Number(jobId)) //-> verifica??ao do objeto, se encontrou o id, apresente

            if(!job){

                return res.send("Job not found!")

            }

            const updatedJob = {

                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }
            Job.data = Job.data.map(job =>{

                if(Number(job.id) === Number(jobId)){

                    job = updatedJob

                }

                return job
            })
            res.redirect('/job/' + jobId)
        },
        delete(req, res){

            const jobId =req.params.id
            
            //Filter = Filtrar(Quando encontrar um true ele vai tirar da aplica??ao (filtrar))
            //Se o ID enviado for diferente mantem ele 
            //Quando encontrar um false ele tira(filtra) gerando um novo array 
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/')

        },
    },

    //fun????es auxiliares
    services: {

        remainingDays(job){

            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
        
            const createdDate = new Date(job.created_at)//Dia que o job foi criado 
            const dueDay = createdDate.getDate() + Number(remainingDays) //Dia da entrega 
            const dueDate = createdDate.setDate(dueDay)//Data exata do vencimento
        
            const timeDiffInMs = dueDate - Date.now() //Diferen??a de dias 
                //Transformar Milli em dias
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)//diferenca em dias arredonada para baixo
        
            return dayDiff;
        },

        calculateBudget: (job,valueHour) => valueHour * job["total-hours"] //calculo de hora

    },

}

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', Profile.controllers.index );
routes.post('/profile', Profile.controllers.update);

module.exports = routes;