const peon = require('../src/peon')
const Event = require('../db/models/event')

module.exports = {
  name: 'deletevent',
  args: true,
  description: 'Deleting entry in db',
  async execute(message) {
    const data = []
    const [name] = peon.parse(message.content).input

    data.push(`Deleting event for:`)
    data.push(`Event: ${name}`)

    message.channel.send(data, { split: true })

    try {
      await Event.query().delete().where({
        name: name,
      })
      return message.reply(`Event "${tagEvent}" deleted.`)
    } catch (e) {
      console.log(e)
      return message.reply('Something went wrong with deleting the event.')
    }
  },
}
