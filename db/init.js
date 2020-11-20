const { Model } = require('objection')
const Knex = require('knex')

module.exports = {
  init() {
    console.log('')
    console.log('Setting up database...')

    // Initialize knex.
    const knex = Knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './db/database.sqlite',
      },
    })

    // Give the knex instance to objection.
    Model.knex(knex)

    console.log('Database setup.')
  },
}
