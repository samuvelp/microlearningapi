const express = require(`express`)
const bodyParser = require(`body-parser`)
const userLearningLinksHandler = require(`./bin/queries/UserLearningLinksHandler`)
const schedular = require(`./bin/post/schedular`)
const port = 5000
const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get(`/subscribe/:uuid/:topic/:devicetoken`,schedular.subscribeToTopic)

app.get(`/userLearningLink/:uuid`, userLearningLinksHandler.getUserLearningLink)

app.get('/', (request, response) => {
  response.json({ info: 'Microlearning platform' })
})

app.listen(port, () => {
  console.log(`app is runningon port:${port}`)
})