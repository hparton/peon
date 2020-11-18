module.exports = {
  name: 'new',
  description: 'new',
  cooldown: 5,
  execute(message, args) {
    message.channel.send('server is auto deploying correctly.')
  },
}
