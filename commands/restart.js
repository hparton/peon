module.exports = {
  name: 'restart',
  description: 'Reloads the bot',
  execute(message, args) {
    message.channel.send(`Okie dokie, me die now`).then(() => {
      process.exit()
    })
  },
}
