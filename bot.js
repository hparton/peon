require('dotenv').config()

const Discord = require('discord.js')
const { work } = require('./src/peon')
const { zug, quote } = require('./commands/zug')
const sentiment = require('./listeners/sentiment')

const client = new Discord.Client()
const peon = work(client)

peon.init()

// Commands
peon.addCommand('!zug', 'zug zug', zug)
peon.addCommand('!poke', 'random wc3 quote', quote)

// Listeners
peon.addListener('message', sentiment)
