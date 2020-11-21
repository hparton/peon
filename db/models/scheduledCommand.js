const { Model } = require('objection')

class ScheduledCommand extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'scheduled_commands'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['frequency', 'name'],
      properties: {
        frequency: { type: 'string', minLength: 1, maxLength: 26 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        args: {
          type: 'object',
        }, // optional
      },
    }
  }
}
module.exports = ScheduledCommand
