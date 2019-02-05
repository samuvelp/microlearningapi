const scraper = require(`google-search-scraper`)
const deathByCaptcha = require('deathbycaptcha')
const dbc = new deathByCaptcha('username', 'password')
const Pool = require(`../../dbcredentials`).pool
const pool = Pool()


const searchLinkForTopic = ((topic, userId, response) => {
    const links = []
    const options = {
        query: `${topic} site:medium.com`,
        // query: '"${topic} site:medium.com"',
        limit: 10,
        age: 'y',
        solver: dbc,
        // params: { query: 'what is "${topic}"' }
    }
    console.log("QQQQQQQ",topic)
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
                    response.status(200).json(links[linkIndex])
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
    })
        .then((result) => {
            console.log(result)
            if (result) {
                checkAndCreateLinkRecord(links, linkIndex + 1, topic, userId, response)
            } else {
                // superSearchLinkForTopic(topic, userId)
                console.log("main super search executed")
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

const superSearchLinkForTopic = (topic, userId) => {
    const superTopicSearchQuery = topic
    searchLinkForTopic(superSearchLinkForTopic, userId)
}

const isLinkInDB = (userId, link) => {
    return new Promise((resolve, reject) => {
        console.log('isLinkInDB()', 'link:', link, 'userid:', userId)
        if (link === undefined)
            resolve(true)
        pool.query(`select * from learninglinks where userid = $1 and link = $2`, [userId, link], (error, results) => {
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
        } catch (error) {
            console.log(error, 'error creating record')
        }
    })
}
module.exports = {
    searchLinkForTopic
}
//TODO

//super search logic

//start schedular to schedule job for user

//start push notification

