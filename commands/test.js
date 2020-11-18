const Uwuifier = require('uwuifier')

const uwuifier = new Uwuifier()

module.exports = {
  name: 'test',
  description: 'test!',
  cooldown: 5,
  execute(message, args) {
    message.channel.send(uwuifier.uwuifySentence(message.content))
  },
}
