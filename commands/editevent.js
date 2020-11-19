const peon = require('../src/peon')
const Event = require('../db/models/event')
const chrono = require('chrono-node')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
  name: 'editevent',
  args: true,
  description: 'Update entry in db',
  async execute(message) {
    const [name, date, description] = peon.parse(message.content).input

    if (!name || !date || !description) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
    }

    const parsedDate = chrono.parseDate(date, new Date(), { forwardDate: true })

    // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
    const affectedRows = await Event.query()
      .patch({
        name,
        date: dayjs(parsedDate).utc(true).format('YYYY-MM-DD HH:mm:ss'),
        description: tagDescription,
      })
      .where({ name: tagEvent })
    if (affectedRows > 0) {
      return message.reply(`Event ${tagEvent} was updated.`)
    }
    return message.reply(`Could not find an event with name ${tagEvent}.`)
  },
}
