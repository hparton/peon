const calendar = require('../src/calendar')

module.exports = {
  name: 'events',
  description: 'Find all entries in db',
  async execute(message, args) {
    const data = await calendar.upcoming()
    message.channel.send(data, { split: false })
  },
}
