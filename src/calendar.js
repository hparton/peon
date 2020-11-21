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

const upcoming = async (withIds = false) => {
  const dateField = 'date'
  const startOfTodayDate = dayjs.utc().subtract(1, 'day').endOf('day').toISOString()
  const endOfTodayDate = dayjs.utc().endOf('day').toISOString()
  const endOfMonthDate = dayjs.utc().endOf('month').toISOString()

  const todaysEvents = await Event.query()
    .where(dateField, '>=', startOfTodayDate)
    .where(dateField, '<', endOfTodayDate)
    .orderBy(dateField)

  const monthsEvents = await Event.query().whereBetween(dateField, [endOfTodayDate, endOfMonthDate]).orderBy(dateField)

  const formatEvent = (event, showDate = false) => {
    return `${showDate ? convertDateToEmoji(dayjs.utc(event[dateField])) + ' ' : ''}${
      !showDate ? '🕐' : ''
    } **${dayjs.utc(event[dateField]).format('hA')}** - **${event.name}** - ${event.description}${
      withIds ? ` | (${event.id})` : ''
    }`
  }

  // Name stays
  // add a type column
  // use the id's to delete
  // add parent_id if it's repeating.

  const data = []

  data.push('🗓️ **Upcoming Guild Events Calendar** 🗓️')

  if (todaysEvents.length) {
    data.push('')
    data.push('**Today**')
    todaysEvents.forEach(function (event) {
      data.push(formatEvent(event))
    })
  }

  if (monthsEvents.length) {
    data.push('')
    data.push(`**${dayjs().format('MMMM')}**`)
    monthsEvents.forEach(function (event) {
      data.push(formatEvent(event, true))
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
