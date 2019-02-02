const scraper = require(`google-search-scraper`)
const Pool = require(`../../dbcredentials`).pool
const pool = Pool()

const searchLinkForTopic = ((topic, userId) => {
    const links = []
    const options = {
        query: '"${topic} site:medium.com"',
        limit: 10,
        age: 'y',
        params: { query: "what is npm" }
    }

    const promise = new Promise((resolve, reject) => {
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
    })
    promise.then(() => {
        checkAndCreateLinkRecord(links, topic, userId)
    }).catch(() => {
        console.log()
    })
})

const checkAndCreateLinkRecord = (links, topic, userId) => {
    new Promise((resolve, reject) => {
        for (var link of links) {
            if (!isLinkInDB(userId, link)) {
                createRecord(userId, link)
                reject("new link created")
                break;
            }
        }
    }).then(() => {
        superSearchLinkForTopic(topic, userId)
    }).catch(() => {

    })
}

const superSearchLinkForTopic = (topic, userId) => {
    const superTopicSearchQuery = topic
    searchLinkForTopic(superSearchLinkForTopic, userId)
}

const isLinkInDB = (userId, link) => {
    console.log('isLinkInDB()', 'link:', link, 'userid:', userId)
    pool.query(`select * from learninglinks where userid = $1 and link = $2`, [userId, link], (error, results) => {
        if (results.rowCount === 0) {
            console.log(false)
            return false
        } else {
            console.log(false)
            return true
        }
    })
}

const createRecord = (userId, link) => {
    console.log('createRecord()', 'userid:', userId, 'link:', link)
    pool.query('insert into learninglinks (userid,link) values($1,$2)', [userId, link], (error, results) => {
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
