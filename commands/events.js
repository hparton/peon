const calendar = require('../src/calendar')
const peon = require('../src/peon')

module.exports = {
  name: 'events',
  description: 'Find all entries in db',
  async execute(message) {
    const { args } = peon.parse(message.content)
    const data = await calendar.upcoming(args.hasOwnProperty('ids'))
    message.channel.send(data, { split: false })
  },
}
