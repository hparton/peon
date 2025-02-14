module.exports = {
  name: 'help',
  description: 'me help',
  aliases: ['commands'],
  usage: '<command name>',
  cooldown: 5,
  execute(message, args) {
    const data = []
    const prefix = process.env.PREFIX
    const { commands } = message.client

    if (!args.length) {
      data.push('Something need doing?')
      data.push(commands.map(command => command.name).join(', '))
      data.push(`\nYou can send \`${prefix}help <command name>\` to get info on a specific command!`)

      return message.author.send(data, { split: true }).catch(error => {
        console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
        message.reply("it seems like I can't DM you! Do you have DMs disabled?")
      })
    }

    const name = args[0].toLowerCase()
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

    if (!command) {
      return message.reply("that's not a valid command!")
    }

    data.push(`**Name:** ${command.name}`)

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
    if (command.description) data.push(`**Description:** ${command.description}`)
    if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`)

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

    message.channel.send(data, { split: true })
  },
}
