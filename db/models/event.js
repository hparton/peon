const { Model } = require('objection')

class Event extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'events'
  }

  // // Optional JSON schema. This is not the database schema!
  // // No tables or columns are generated based on this. This is only
  // // used for input validation. Whenever a model instance is created
  // // either explicitly or implicitly it is checked against this schema.
  // // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'date', 'description', 'created_by'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        date: { type: 'datetime' },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        created_by: { type: 'string' },
      },
    }
  }
}

module.exports = Event
