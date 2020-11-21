const { Model } = require('objection')

class PersistantMessage extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'persistant_messages'
  }
}

module.exports = PersistantMessage
