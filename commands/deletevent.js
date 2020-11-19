const Event = require('../db/models/event')

module.exports = {
  name: 'deletevent',
  description: 'Deleting entry in db',
  async execute(message) {
    const data = []

    const input = message.content.slice(process.env.PREFIX.length).trim().split(/ +/)
    const command = input.shift().toLowerCase()

    const tagEvent = input[0]

    if (!input.length) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
    }

    data.push(`Deleting event for:`)
    data.push(`Event: ${tagEvent}`)

    message.channel.send(data, { split: true })

    try {
      await Event.query().delete()
      .where({ 
        name: tagEvent
        })
      return message.reply(`Event "${tagEvent}" deleted.`)
    } catch (e) {
      console.log(e)
      return message.reply('Something went wrong with deleting the event.')
    }
  },
}
