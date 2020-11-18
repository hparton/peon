module.exports = {
  name: 'restart',
  description: 'Reloads the bot',
  execute(message, args) {
    message.channel.send(`Ok restarting!`).then(() => {
      process.exit()
    })
  },
}
