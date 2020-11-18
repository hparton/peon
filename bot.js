require('dotenv').config()

const Discord = require('discord.js')
const peon = require('./src/peon')
const sentiment = require('./listeners/sentiment')

const client = new Discord.Client()
const worker = peon.work(client)

worker.wake()
worker.instructions('./commands')
worker.listen(process.env.PREFIX)

// Listeners
worker.addListener('message', sentiment)
