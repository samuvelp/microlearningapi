const cron = require('node-cron')
const Pool = require('../../dbcredentials').pool
const searchController = require('./searchController')
const pool = Pool()


const subscribe = (topic, userId, deviceToken, response) => {
    storeUserSubscription(topic, userId, deviceToken, response)
}
const storeUserSubscription = (topic, userId, deviceToken, response) => {
    pool.query(`INSERT INTO subscription (userid,devicetoken,topic,isactive,subscribedat) VALUES($1,$2,$3,$4,$5)`,
        [userId, deviceToken, topic, true, new Date().getTime()]
        , (error, results) => {
            if (error) {
                console.log(error, "subscription insert failed")
            } else {
                console.log("Subscribed for userid:".userId, "Success!")
                //immediate search response for first time subscribers
                searchController.searchLinkForTopic(topic, userId, response)
                //cron job to run every day at 8:30 am of locale //todo find local time of the user
                cron.schedule(`30 08 * * *`, () => {
                    searchController.searchLinkForTopic(topic, userId, response)
                })
            }
        })
}