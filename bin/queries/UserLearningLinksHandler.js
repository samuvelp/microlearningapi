const Pool = require('../../dbcredentials').pool
const pool = Pool()
//responding users with the array of shared links
const getUserLearningLink = (request, response) => {
    const userId = (request.params.uuid)
    console.log(userId)
    pool.query(`select * from learninglinks where userid = $1`, [userId],
        (error, results) => {
            try {
                const links = convertArrayOfJsonToLinks(results.rows)
                console.log("Link sent")
                updateTableForLinksQueried(userId, links)
                response.status(200).json(links)
            } catch (error) {
                console.log(error)
                response.status(500).json(error)
            }
        })
}

//update database for the links queried
const updateTableForLinksQueried = (userid, links) => {
    //update lastsent, increment sessions
    for (var i = 0; i < links.length; i++) {
        pool.query(`update learninglinks set lastsent = $1,sessions = sessions + $2 where userid =$3 and link = $4`,
            [new Date().getTime(), 1, userid, links[i]],
            (error, results) => {
                if (error) {
                    console.log(error, `update error`)
                } else {
                    console.log("Updated")
                }
            })
    }
}

//converting array of json to array of links
const convertArrayOfJsonToLinks = (dataArray) => {
    const links = []
    for (var i = 0; i < dataArray.length; i++) {
        const stringfyObject = JSON.stringify(dataArray[i])
        const objectValue = JSON.parse(stringfyObject)
        links.push(objectValue['link'])
    }
    return links
}
module.exports = {
    getUserLearningLink,
}
