const scraper = require(`google-search-scraper`)
const subscribeToTopic = (request, response) => {
    // const userid = request.params.uuid
    // const topic = request.params.topic
    // const options = {
    //     query: "dell monitor",
    //     limit: 10
    // }
    // scraper.search(options, (err, url) => {
    //     if (err) throw err
    //     console.log("Hello world")
    // })
    var options = {
        query: '"node js"',
        limit: 10,
        age :'"d1"',
        params : {key:"what is npm"}
      };
       
      scraper.search(options, function(err, url, meta) {
        // This is called for each result
        if(err) throw err;
        console.log(url);

      });
}
module.exports = {
    subscribeToTopic
}