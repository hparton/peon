const tableName = 'events'

exports.up = function (knex) {
  return knex.schema.table(tableName, function (t) {
    t.enu('repeat', ['daily', 'weekly', 'monthly', 'yearly'])
  })
}

exports.down = function (knex) {
  return knex.schema.table(tableName, function (t) {
    t.dropColumn('repeat')
  })
}
