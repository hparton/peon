const tableName = 'persistant_messages'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary()
    table.string('key', 255).notNullable()
    table.string('message_id', 255).notNullable()
    table.string('channel_id', 255).notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
