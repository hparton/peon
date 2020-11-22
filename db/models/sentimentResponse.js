const { Model } = require('objection')

class SentimentResponse extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'sentiment_responses'
  }
}
module.exports = SentimentResponse
