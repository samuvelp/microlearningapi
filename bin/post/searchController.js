const scraper = require(`google-search-scraper`)
const deathByCaptcha = require('deathbycaptcha')
const dbc = new deathByCaptcha('username', 'password')
const pushNotification = require(`./pushNotification`)
const Pool = require(`../../dbcredentials`).pool
const pool = Pool()

const searchLinkForTopic = ((topic, userId, response) => {
    const links = []
    const superTopicSearchQuery = randomQuestion(topic)
    const options = {
        query: `${superTopicSearchQuery} site:medium.com`,
        // query: '"${topic} site:medium.com"',
        limit: 10,
        age: 'y',
        solver: dbc,
        // params: {
        //     query: `what is "${topic}"`,
        //     query: `how  "${topic}"`,
        //     query: `where "${topic}"`
        // }
    }
    console.log("QQQQQQQ", superTopicSearchQuery)
    new Promise((resolve, reject) => {
        scraper.search(options, (err, url, meta) => {
            try {
                console.log(url)
                links.push(url)
                resolve(links, userId)
            } catch (err) {
                console.log(err)
                reject("Server error")
            }
        })
    }).then(() => {
        checkAndCreateLinkRecord(links, 0, topic, userId, response)
    }).catch((err) => {
        console.log(err)
    })
})

const checkAndCreateLinkRecord = (links, linkIndex, topic, userId, response) => {
    new Promise((resolve, reject) => {
        isLinkInDB(userId, links[linkIndex])
            .then((value) => {
                console.log(links.length, linkIndex)
                console.log(value, "inside islinkindb promise")
                if (!value) {
                    console.log("inside false scope")
                    createRecord(userId, links[linkIndex])
                    //returning response with inserted link
                    response.status(200).json(finalLinkJson(links[linkIndex]))
                    links = []
                    reject("new link created")
                } else if (value && (links.length > linkIndex)) {
                    resolve(true)
                    //recurse to check the rest of the links if available
                } else {
                    resolve(false)
                    //else do the super special link query search
                }
            })
            .catch(() => {

            })
    })
        .then((result) => {
            console.log(result)
            if (result) {
                checkAndCreateLinkRecord(links, linkIndex + 1, topic, userId, response)
            } else {
                superSearchLinkForTopic(topic, userId, response)
                console.log("main super search executed")
            }
        })
        .catch((err) => {
            console.log(err)
        })
}


const isLinkInDB = (userId, link) => {
    return new Promise((resolve, reject) => {
        console.log('isLinkInDB()', 'link:', link, 'userid:', userId)
        if (link === undefined)
            resolve(true)
            pool.connect()
        pool.query(`SELECT * FROM learninglinks WHERE userid = $1 and link = $2`, [userId, link], (error, results) => {
            if (results.rowCount === 0) {
                console.log(false)
                resolve(false)
            } else {
                console.log(true)
                resolve(true)
            }
        })
    })
}

const createRecord = (userId, link) => {
    console.log('createRecord()', 'userid:', userId, 'link:', link)
    pool.query('insert into learninglinks (userid,link,createdat,lastsent,sessions) values($1,$2,$3,$4,$5)', [userId, link, new Date().getTime(), 0, 0], (error, results) => {
        try {
            console.log('Inserted into learninglink for userid:', userId, 'with link:', link)
            sendPushNotification(userId, link)
        } catch (error) {
            console.log(error, 'error creating record')
        }
    })
}
const superSearchLinkForTopic = (topic, userId, response) => {
    const superTopicSearchQuery = randomQuestion(topic)
    searchLinkForTopic(superTopicSearchQuery, userId, response)
}

const randomQuestion = (topic) => {
    var specialQuery = ""
    const max = 10
    const min = 1
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min)
    switch (randomNumber) {
        case 1:
            specialQuery = `what is the latest trends of ${topic}`
            break;
        case 2:
            specialQuery = `example of ${topic}`
            break;
        case 3:
            specialQuery = `sample of ${topic}`
            break;
        case 4:
            specialQuery = `knowledge of ${topic}`
            break;
        case 5:
            specialQuery = `how to ${topic}`
            break;
        case 6:
            specialQuery = `which is the best ${topic}`
            break;
        case 7:
            specialQuery = `${topic} is used in`
            break;
        case 8:
            specialQuery = `benefits of knowing ${topic}`
            break;
        case 9:
            specialQuery = `when is ${topic}`
            break;
        case 10:
            specialQuery = `what is ${topic}`
            break;
    }
    return specialQuery
}

const finalLinkJson = (link) => {
    return json = `{` +
        `url : ${link}` +
        `}`
}
const sendPushNotification = (userId, link) => {
    getDeviceToken(userId)
        .then((value) => {
            const payload={
                title : "Today's microlearning content",
                body : "We just brought you the best resource for you to learn",
                url : link
            }
            pushNotification.sendNotification(value,payload)
        })
        .catch((value) => {

        })
    // pushNotification.sendNotification()
}
const getDeviceToken = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT devicetoken FROM subscription WHERE userid = $1 order by subscribedat desc limit 1`,
            [userId], (error, result) => {
                if (result.rowCount > 0) {
                    console.log(result.rows[0].devicetoken)
                    resolve(result.rows[0].devicetoken)
                } else {
                    console.log(error)
                    reject()
                }
            })
    })
}
module.exports = {
    searchLinkForTopic
}
//TODO

//super search logic

//start schedular to schedule job for user

//start push notification

