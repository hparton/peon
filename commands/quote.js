const { say } = require('../src/peon')

const quote = message => {
  message.channel.send(say())
}

module.exports = {
    quote
}