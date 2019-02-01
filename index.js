const express = require(`express`)
const bodyParser = require(`body-parser`)
const userLearningLinksHandler = require(`./bin/queries/UserLearningLinksHandler`)
const topicSubscribeHandler = require(`./bin/post/topicSubscribeHandler`)
const port = 4000
const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get(`/subscribe/`, topicSubscribeHandler.subscribeToTopic)
app.get(`/userLearningLink/:uuid`, userLearningLinksHandler.getUserLearningLink)

app.get('/', (request, response) => {
  response.json({ info: 'Microlearning platoform' })
})

app.listen(port, () => {
  console.log(`app is runningon port:${port}`)
})