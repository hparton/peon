const tableName = 'sentiment_responses'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary()
    table.text('message')
    table.string('author_id', 255)
    table.integer('score')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
