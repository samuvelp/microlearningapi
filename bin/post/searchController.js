const scraper = require(`google-search-scraper`)
const deathByCaptcha = require('deathbycaptcha')
const dbc = new deathByCaptcha('username','password')
const Pool = require(`../../dbcredentials`).pool
const pool = Pool()


const searchLinkForTopic = ((topic, userId) => {
    const links = []
    const options = {
        query: '"${topic} site:medium.com"',
        limit: 10,
        age: 'y',
        solver:dbc,
        params: { query: "what is npm" }
    }

    const promise = new Promise((resolve, reject) => {
        scraper.search(options, (err, url, meta) => {
            try {
                console.log(err)
                console.log(url)
                // if (url != undefined) {
                //     links.push(url)
                //     resolve(links, userId)
                // }
            } catch (err) {
                console.log(err)
                reject("Server error")
            }
        })
    })
    promise.then(() => {
        checkAndCreateLinkRecord(links, 0, topic, userId)
    }).catch((err) => {
        console.log(err)
    })
})

const checkAndCreateLinkRecord = (links, linkIndex, topic, userId) => {
    new Promise((resolve, reject) => {
        isLinkInDB(userId, links[linkIndex])
            .then((value) => {
                console.log(links.length, linkIndex)
                console.log(value, "inside islinkindb promise")
                if (!value) {
                    console.log("inside false scope")
                    createRecord(userId, links[linkIndex])
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
                checkAndCreateLinkRecord(links, linkIndex + 1, topic, userId)
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
    pool.query('insert into learninglinks (userid,link,createdat,lastsent,sessions) values($1,$2,$3,$4,$5)', [userId, link, new Date().getTime()], (error, results) => {
        try {
            console.log(`Inserted into learninglink for userid :$1 with link:$2`, [results.userid, results.link])
        } catch (error) {
            console.log('error creating record')
        }
    })
}
module.exports = {
    searchLinkForTopic
}
//create db with required column

// getLinks
// for(links){
//     if(!links in db){
//     store in db
//     send notification
//     break
//     }

// }
// getMoreNewLinks by differing age, query string, 
