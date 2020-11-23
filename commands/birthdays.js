const calendar = require('../src/calendar')
const peon = require('../src/peon')
const uuid = require('uuid')
const persist = require('../src/persistantMessage')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
  name: 'birthdays',
  usage: '<--month> <--user> <--daily>',
  description: 'Check for birthdays.',
  async execute(message) {
    const { args } = peon.parse(message.content)
    const input = peon.parse(message.content).input
    const id = uuid.v4()

    if (args.hasOwnProperty('user')) {
      const specificUser = input
      const data = await calendar.birthdays('', specificUser)
      return await message.channel.send(data, { split: false })
    }

    if (args.hasOwnProperty('month')) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const specificMonth = months.indexOf(input.toString())
      const data = await calendar.birthdays(specificMonth, '')
      return await message.channel.send(data, { split: false })
    }

    const data = await calendar.birthdays()
    const sentMessage = await message.channel.send(data, { split: false })

    if (args.hasOwnProperty('daily')) {
        await persist.create(id, async () => {
          return sentMessage
        })
        peon.schedule(message.client, '* 09 * * *', 'birthdays', { id }, { immediate: false })
    }

  },
}
