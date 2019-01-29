const express = require(`express`)
const bodyParser = require(`body-parser`)
const db = require(`./queries`)
const port = 4000
const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get(`/userLearningLink/:uuid`, db.getUserLearningLink)

app.get('/', (request, response) => {
  response.json({ info: 'Microlearning platoform' })
})

app.listen(port, () => {
  console.log(`app is runningon port:${port}`)
})