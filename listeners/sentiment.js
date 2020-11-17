var ml = require('ml-sentiment')
const sentiment = ml({ lang: 'en' })

module.exports = message => {
  if (message.content.includes('!ana')) {
    const data = message.content
    const body = data.replace('!ana', '')
    const score = sentiment.classify(body)

    if (score < 0) {
      message.react('👎')
    } else if (score > 0) {
      message.react('👍')
    } else if (score === 0) {
      message.react('😐')
    } else {
      message.react('🤷‍♂️')
    }
  }
}
