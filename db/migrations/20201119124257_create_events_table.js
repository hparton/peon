const tableName = 'events'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.datetime('date', 255).notNullable()
    table.string('description', 255).notNullable()
    table.string('created_by', 255).notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
