const { Model } = require('objection')

class PollResult extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'poll_results'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        results: {
          type: 'array',
        },
        options: {
          type: 'array',
        },
      },
    }
  }
}

module.exports = PollResult
