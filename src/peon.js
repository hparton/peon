const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')

const say = () => {
  const quotes = [
    'Work, work.',
    'I can do that.',
    'Something need doing?',
    'What you want?',
    'Me busy. Leave me alone!!',
    'Me not that kind of orc!',
    'No time for play.',
    'Why you poking me again?',
    'Work is da poop! NO MORE!',
    'Me no work no more!',
    'I am da powerful! Nobody tell me what to do!',
    'HEY! No more booterang! Me sorry! Me work!',
    'It put the mutton in the stomach!',
    'OWWWW! Ok, ok, me go back to work!',
    'OOF! Booterang hurted me! Me tink work better den booterang!',
  ]

  return quotes[Math.floor(Math.random() * quotes.length)]
}

const work = client => {
  const cooldowns = new Discord.Collection()

  const wake = () => {
    client.commands = new Discord.Collection()

    client.once('ready', () => {
      console.log('====================================')
      console.log(' _____   _  __ _   _____   _  __ _ ')
      console.log('|_  / | | |/ _\\ | |_  / | | |/ _\\ |')
      console.log(' / /| |_| | (_| |  / /| |_| | (_| |')
      console.log('/___|\\__,_|\\__, | /___|\\__,_|\\__, |')
      console.log('           |___/             |___/ ')
      console.log('')
      console.log(say())

      client.user.setPresence({
        status: 'online',
        activity: {
          name: 'zug zug ~ !help',
          type: 'PLAYING',
        },
      })
    })

    client.login(process.env.CLIENT_TOKEN)
  }

  const instructions = dir => {
    const directory = path.resolve(require.main.path, dir)
    const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`${directory}/${file}`)

      // set a new item in the Collection
      // with the key as the command name and the value as the exported module
      client.commands.set(command.name, command)
    }
  }

  const listen = prefix => {
    addListener('message', message => {
      if (!message.content.startsWith(prefix) || message.author.bot) return

      const args = message.content.slice(prefix.length).trim().split(/ +/)
      const commandName = args.shift().toLowerCase()
      const command =
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

      if (!command) return

      if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply("I can't execute that command inside DMs!")
      }

      if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`

        if (command.usage) {
          reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply)
      }

      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
      }

      const now = Date.now()
      const timestamps = cooldowns.get(command.name)
      const cooldownAmount = (command.cooldown || 3) * 1000

      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000
          return message.reply(
            `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
          )
        }
      }

      timestamps.set(message.author.id, now)
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

      try {
        command.execute(message, args)
      } catch (error) {
        console.error(error)
        message.reply('there was an error trying to execute that command!')
      }
    })
  }

  const addCommand = command => {
    client.commands.set(command.name, command)
  }

  const addListener = (key, cb) => {
    client.on(key, cb)
  }

  return {
    client,
    wake,
    listen,
    instructions,
    addCommand,
    addListener,
  }
}

module.exports = {
  work,
  say,
}
