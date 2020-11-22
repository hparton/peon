var ml = require('ml-sentiment')
const sentiment = ml({ lang: 'en' })
const SentimentResponse = require('../db/models/sentimentResponse')

module.exports = async message => {
  if (message.author.id === '175522463428378624') {
    const data = message.content
    const score = sentiment.classify(data)

    if (score <= -2) {
      await SentimentResponse.query().insert({
        author_id: message.author.id,
        message: data,
        score,
      })
    }
  }
}
