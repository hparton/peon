const peon = require('../src/peon')

module.exports = {
  name: 'poke',
  aliases: ['work'],
  description: 'work work',
  cooldown: 5,
  execute(message, args) {
    message.channel.send(peon.say())
  },
}
