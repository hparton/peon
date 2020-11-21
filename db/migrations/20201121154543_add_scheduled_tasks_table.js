const tableName = 'scheduled_commands'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary()
    table.string('frequency', 255).notNullable()
    table.string('name', 255).notNullable()
    table.text('args')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
