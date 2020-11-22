const peon = require('../src/peon')
const Event = require('../db/models/event')
const chrono = require('chrono-node')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
  name: 'editevent',
  args: true,
  usage: '<id>, <name>, <time>, <description>',
  description: 'Edit an existing event',
  async execute(message) {
    const [id, name, date, description] = peon.parse(message.content).input

    if (!name || !date || !description) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
    }

    const parsedDate = chrono.parseDate(date, new Date(), { forwardDate: true })

    // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
    const affectedRows = await Event.query()
      .patch({
        name,
        date: dayjs(parsedDate).utc(true).format('YYYY-MM-DD HH:mm:ss'),
        description,
      })
      .where({ id })
    if (affectedRows > 0) {
      return message.reply(`Event ${id} was updated.`)
    }
    return message.reply(`Could not find an event with name ${id}.`)
  },
}
