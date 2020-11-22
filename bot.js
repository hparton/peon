require('dotenv').config()

const Discord = require('discord.js')
const peon = require('./src/peon')
const sentiment = require('./listeners/sentiment')

// this might need more partials enabling to work. --> 'USER', 'GUILD_MEMBER'
const client = new Discord.Client({ partials: ['USER', 'GUILD_MEMBER', 'REACTION'] })

const worker = peon.work(client, process.env.PREFIX)

worker.wake()
worker.instructions('./commands')
worker.scheduled()
worker.listen()

// Listeners
worker.addListener('message', sentiment)
