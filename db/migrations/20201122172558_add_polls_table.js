const tableName = 'poll_results'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary()
    table.string('message_id', 255)
    table.text('question')
    table.text('options')
    table.text('results')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
