require('dotenv').config()

const Discord = require('discord.js')
const peon = require('./src/peon')
const sentiment = require('./listeners/sentiment')
const persist = require('./src/persistantMessage')
const calendar = require('./src/calendar')
const client = new Discord.Client()

const worker = peon.work(client, process.env.PREFIX)

worker.wake()
worker.instructions('./commands')
worker.listen()

worker.schedule('events-info', '*/5 * * * *', async () => {
  console.log('Running events-info')
  const infoChannel = await client.channels.fetch(`${process.env.INFO_CHANNEL || '772847261196877826'}`)
  const data = await calendar.upcoming()

  let existingMessage = await persist.find(client, 'info-test')

  if (existingMessage) {
    existingMessage.edit(data)
    return
  }

  persist.create('info-test', async () => {
    return await infoChannel.send(data, { split: false })
  })
})

// Listeners
worker.addListener('message', sentiment)
