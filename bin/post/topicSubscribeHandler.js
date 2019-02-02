const scraper = require(`google-search-scraper`)
const searchController = require(`./searchController`)
const subscribeToTopic = (request, response) => {
    // const userid = request.params.uuid
    // const topic = request.params.topic
    // const searchAge=request.params.searchAge (latest/alltime)
    searchController.searchLinkForTopic("nodejs","550e8400-e29b-41d4-a716-446655440034")
}
module.exports = {
    subscribeToTopic
}