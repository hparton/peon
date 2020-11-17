const { say } = require('../src/peon')

const zug = message => {
  message.channel.send('zug zug')
}

const quote = message => {
  message.channel.send(say())
}

module.exports = {
  zug,
  quote,
}
