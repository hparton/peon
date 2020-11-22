const peon = require('../src/peon')
const Event = require('../db/models/event')
const chrono = require('chrono-node')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
  name: 'addevent',
  args: true,
  usage: '<name>, <time>, <description>',
  description: 'Add a new event to the calendar',
  async execute(message) {
    const data = []
    const [name, date, description] = peon.parse(message.content).input

    if (!name || !date || !description) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
    }

    const parsedDate = chrono.parseDate(date, new Date(), { forwardDate: true })

    data.push(`Adding event for:`)
    data.push(`Name: ${name}`)
    data.push(`Date: ${parsedDate}`)
    data.push(`Description: ${description}`)

    message.channel.send(data, { split: false })

    try {
      // equivalent to: INSERT INTO tags (name, description, event, username) values (?, ?, ?);
      await Event.query().insert({
        name: name,
        date: dayjs(parsedDate).utc(true).format('YYYY-MM-DD HH:mm:ss'),
        description: description,
        created_by: message.author.username,
      })
      return message.reply(`Event "${name}" added.`)
    } catch (e) {
      console.log(e)
      if (e.name === 'SequelizeUniqueConstraintError') {
        return message.reply('That event already exists.')
      }
      return message.reply('Something went wrong with adding the event.')
    }
  },
}
