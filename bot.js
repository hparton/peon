require('dotenv').config()

const Discord = require('discord.js')
const peon = require('./src/peon')
const { zug, quote } = require('./commands/zug')
const sentiment = require('./listeners/sentiment')

const client = new Discord.Client()
const worker = peon.work(client)

worker.init()

// Commands
worker.addCommand('!zug', 'zug zug', zug)
worker.addCommand('!poke', 'random wc3 quote', quote)

// Listeners
worker.addListener('message', sentiment)
