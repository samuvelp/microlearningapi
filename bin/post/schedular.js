const cron = require('node-cron')
const Pool = require('../../dbcredentials').pool
const pool = Pool()

cron.schedule(`39 23 * * *`, () => {
    console.log('Running evert 5 sec dude')
})
const subscribe = (topic, userId, deviceToken, response) => {

}
const storeUserSubscription = (topic, userId, deviceToken) => {
    pool.query(`INSERT INTO subscription (userid,devicetoken,topic,isactive,subscribedat) VALUES($1,$2,$3,$4,$5)`,
        [userId,deviceToken,topic,true,new Date().getTime()]
        ,(error,results)=>{
            if(error){
                console.log(error,"subscription insert failed")
            }else{
                console.log("Subscribed for userid:".userId,"Success!")
            }
        })
}