const scraper = require(`google-search-scraper`)
const searchController = require(`./searchController`)
const subscribeToTopic = (request, response) => {
    const userid = request.params.uuid
    const topic = request.params.topic
    // const searchAge=request.params.searchAge (latest/alltime)
    console.log(userid,topic)
    searchController.searchLinkForTopic(topic,userid,response)
    
}
module.exports = {
    subscribeToTopic
}