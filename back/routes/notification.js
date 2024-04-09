const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Notification , User } = require('../models');
const cron = require("node-cron");


const router = express.Router();
require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });


const notisHandler = {
	tasks: [],
	addTask(clientIp, task) {
		this.tasks.push({ [clientIp]: task });
	},
	getAllTasks() {
		return this.tasks;
	},
	removeTask(clientIp) {
		const removeTask = this.tasks.filter((task) => !task[clientIp]);
		this.tasks = removeTask;
	},
};


router.post("/logout",isLoggedIn,async(req,res,next) => {
    try{ 
        const browser = req.header('User-Agent')
        const clientIp = req.ip.replace(/^::ffff:/, '') 

        notisHandler.removeTask(browser+clientIp);
        res.status(200)
    } catch(err) {
        console.log(err)
    }
})

router.post("/reception",isLoggedIn,async(req,res,next) => {
    try{ 
        await Notification.update(
            {reception:'Y'},{where:{id:req.body.id}}
        )
        const notis = await Notification.findAll({
            where: {targetId: req.user.id,reception:'N'},
            include:[{
                model : User,
                attributes: ['nickname', 'profileImageUrl'],
              }]
        })
        res.status(200).json(notis);
    }catch(err) {
        console.log(err)
    }
})

router.get("/load",isLoggedIn,async(req,res,next) => {
    try{
        const browser = req.header('User-Agent')
        const clientIp = req.ip.replace(/^::ffff:/, '') 

        notisHandler.addTask(browser+clientIp,() => {
            new Promise(async (resolve) => {
                const notis = await Notification.findAll({
                    where: {targetId: req.user.id,reception:'N'},
                    include:[{
                        model : User,
                        attributes: ['nickname', 'profileImageUrl'],
                      }]
                })
    
                resolve(notis)
            }).then(v => {

                  res.write(`data: ${JSON.stringify(v)}\n\n`);
            })
        })

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache",
          });
        
        
        req.on('close', () => {
            notisHandler.removeTask(browser+clientIp);
        });
    
        
    } catch( err ) {
        console.log("???????????????",err)
    }
})

router.post("/",isLoggedIn,async(req,res,next) => {
    try{
        const emails = req.body.emails

        for (const email of emails) {
            const user = await User.findOne({where:{email}})

            await Notification.create({
                content:req.body.content,
                senderId: req.user.id,
                targetId: user.id,
                reception: 'N'
            })
        }
  
        
        
    } catch( err ) {
        
    }
})


cron.schedule(
	'*/5 * * * * *',
	async () => {
		console.log('업데이트 스케줄링 실행');
        const tasks = notisHandler.getAllTasks();
        const taskFn = tasks.map((task) => Object.values(task)[0]());
        Promise.all(taskFn);
	},
	{
		name: 'lunch-menu-update-task',
		timezone: 'Asia/Seoul',
	}
);


module.exports = router;