require('dotenv').config()

const Discord = require('discord.js')
const peon = require('./src/peon')
const sentiment = require('./listeners/sentiment')

const client = new Discord.Client()

const worker = peon.work(client, process.env.PREFIX)

worker.wake()
worker.instructions('./commands')
worker.scheduled()
worker.listen()

// Listeners
worker.addListener('message', sentiment)
