const { Model } = require('objection')
const Knex = require('knex')

module.exports = {
  init() {
    console.log('')
    console.log('Set up db, more work')

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

    console.log('db setup')
  },
}
