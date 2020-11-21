const peon = require('../src/peon')
const Event = require('../db/models/event')

module.exports = {
  name: 'deletevent',
  args: true,
  usage: '!deleteevent <id>',
  description: 'Deleting entry in db',
  async execute(message) {
    const data = []
    const [id] = peon.parse(message.content).input

    message.channel.send(data, { split: true })

    try {
      const event = await Event.query().delete().where({
        id: id,
      })
      return message.reply(`Event "${id}" deleted.`)
    } catch (e) {
      console.log(e)
      return message.reply('Something went wrong with deleting the event.')
    }
  },
}
