const calendar = require('../src/calendar')
const peon = require('../src/peon')
const uuid = require('uuid')
const persist = require('../src/persistantMessage')

module.exports = {
  name: 'events',
  usage: '<--ids> <--live>',
  description: 'Get all the upcoming events for the month.',
  async execute(message) {
    const { args } = peon.parse(message.content)
    const id = uuid.v4()

    const data = await calendar.upcoming(args.hasOwnProperty('ids'))
    const sentMessage = await message.channel.send(data, { split: false })

    if (args.hasOwnProperty('live')) {
      await persist.create(id, async () => {
        return sentMessage
      })

      peon.schedule(message.client, '*/5 * * * *', 'upcoming', { id }, { immediate: false })
    }
  },
}
