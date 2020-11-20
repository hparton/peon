const persist = require('../src/persistantMessage')
const calendar = require('../src/calendar')

module.exports = {
  name: 'events-calendar',
  immediate: true,
  description: 'Update the calendar command every 5 minutes.',
  format: '*/5 * * * *',
  execute: async client => {
    const infoChannel = await client.channels.cache.get(`${process.env.INFO_CHANNEL || '772847261196877826'}`)
    const data = await calendar.upcoming()

    let existingMessage = await persist.find(client, 'info-test')

    if (existingMessage) {
      existingMessage.edit(data)
      return
    }

    persist.create('info-test', async () => {
      return await infoChannel.send(data, { split: false })
    })
  },
}
