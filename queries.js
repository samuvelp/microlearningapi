const Pool = require('./dbcredentials').pool
const pool =  Pool()
//responding users with the array of shared links
const getUserLearningLink = (request, response) => {
    const userId = (request.params.uuid)
    console.log(userId)
    pool.query(`select * from learninglinks where userid = $1`, [userId],
        (error, results) => {
            if (error) {
                throw error
                return
                console.log("error")
            }
            const link = convertArrayOfJsonToLinks(results.rows)
            console.log(link)
            response.status(200).json(link)
        })
}

//converting array of json to array of links
function convertArrayOfJsonToLinks(dataArray) {
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