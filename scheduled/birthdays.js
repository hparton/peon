const calendar = require('../src/calendar')

module.exports = {
  name: 'birthdays',
  description: 'Search for birthdays every day at 9.',
  async execute() {
    const data = await calendar.birthdays()
  },
}
