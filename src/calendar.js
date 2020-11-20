const Event = require('../db/models/event')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

const convertDateToEmoji = date => {
  const emoji = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']

  let dayOfMonth = date.date().toString().split('')

  return dayOfMonth.reduce((str, number) => {
    return `${str}${emoji[number]}`
  }, '')
}

const upcoming = async () => {
  const dateField = 'date'
  const startOfTodayDate = dayjs.utc().subtract(1, 'day').endOf('day').toISOString()
  const endOfTodayDate = dayjs.utc().endOf('day').toISOString()
  const endOfMonthDate = dayjs.utc().endOf('month').toISOString()

  const todaysEvents = await Event.query()
    .where(dateField, '>=', startOfTodayDate)
    .where(dateField, '<', endOfTodayDate)
    .orderBy(dateField)

  const monthsEvents = await Event.query().whereBetween(dateField, [endOfTodayDate, endOfMonthDate]).orderBy(dateField)

  const data = []

  data.push('🗓️ **Upcoming Guild Events Calendar** 🗓️')

  if (todaysEvents.length) {
    data.push('')
    data.push('**Today**')
    todaysEvents.forEach(function (event) {
      data.push(`**${event.name}** - ${event.description}`)
    })
  }

  if (monthsEvents.length) {
    data.push('')
    data.push(`**${dayjs().format('MMMM')}**`)
    monthsEvents.forEach(function (event) {
      data.push(`${convertDateToEmoji(dayjs.utc(event[dateField]))} **${event.name}** - ${event.description}`)
    })
  }

  if (!todaysEvents.length && !monthsEvents.length) {
    data.push('')
    data.push('Nothing much.')
  }

  return data
}

module.exports = {
  upcoming,
  convertDateToEmoji,
}
