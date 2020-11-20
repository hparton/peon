require('dotenv').config()

const Discord = require('discord.js')
const peon = require('./src/peon')
const sentiment = require('./listeners/sentiment')
const persist = require('./src/persistantMessage')
const client = new Discord.Client()

const worker = peon.work(client, process.env.PREFIX)

const Event = require('./db/models/event')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

worker.wake()
worker.instructions('./commands')
worker.listen()

dayjs.extend(utc)

const convertDateToEmoji = date => {
  const emoji = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']

  let dayOfMonth = date.date().toString().split('')

  return dayOfMonth.reduce((str, number) => {
    return `${str}${emoji[number]}`
  }, '')
}

// Potential schedule format?
//www.npmjs.com/package/node-schedule
// run the related command every 5 minutes
// client.on('ready', async () => {
//   worker.schedule('*/5 * * * *', async () => {
//     console.log('Updating events post...')

//     const infoChannel = client.channels.cache.find(
//       channel => channel.id === process.env.INFO_CHANNEL || '735769013489238026'
//     )

//     const dateField = 'date'
//     const startOfTodayDate = dayjs.utc().subtract(1, 'day').endOf('day').toISOString()
//     const endOfTodayDate = dayjs.utc().endOf('day').toISOString()
//     const endOfMonthDate = dayjs.utc().endOf('month').toISOString()

//     const todaysEvents = await Event.query()
//       .where(dateField, '>=', startOfTodayDate)
//       .where(dateField, '<', endOfTodayDate)
//       .orderBy(dateField)

//     const monthsEvents = await Event.query()
//       .whereBetween(dateField, [endOfTodayDate, endOfMonthDate])
//       .orderBy(dateField)

//     const data = []

//     data.push('🗓️ **Upcoming Guild Events Calendar** 🗓️')

//     if (todaysEvents.length) {
//       data.push('')
//       data.push('**Today**')
//       todaysEvents.forEach(function (event) {
//         data.push(`**${event.name}** - ${event.description}`)
//       })
//     }

//     if (monthsEvents.length) {
//       data.push('')
//       data.push(`**${dayjs().format('MMMM')}**`)
//       monthsEvents.forEach(function (event) {
//         data.push(`${convertDateToEmoji(dayjs.utc(event[dateField]))} **${event.name}** - ${event.description}`)
//       })
//     }

//     if (!todaysEvents.length && !monthsEvents.length) {
//       data.push('')
//       data.push('Nothing much.')
//     }

//     let existingMessage = await persist.find(client, 'info-test')

//     if (existingMessage) {
//       existingMessage.edit(data)
//       return
//     }

//     persist.create('info-test', async () => {
//       return await infoChannel.send(data, { split: false })
//     })
//   })
// })

// Listeners
worker.addListener('message', sentiment)
