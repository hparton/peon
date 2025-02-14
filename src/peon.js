const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const DB = require('../db/init')
const nodeSchedule = require('node-schedule')
const ScheduledCommand = require('../db/models/scheduledCommand')

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
    'I am da powerful! Nobody tell me what to do!',
    'HEY! No more booterang! Me sorry! Me work!',
    'It put the mutton in the stomach!',
    'OWWWW! Ok, ok, me go back to work!',
    'OOF! Booterang hurted me! Me tink work better den booterang!',
    'I am the x3 Peon, the x3 bestest and smawtest bot in the x3 wowwd, bow befowe me!?',
  ]

  return quotes[Math.floor(Math.random() * quotes.length)]
}

const schedule = async (client, frequency, name, args) => {
  const scheduledCommand = await ScheduledCommand.query().insert({
    frequency,
    name,
    args,
  })

  runSchedule(client, frequency, name, args, scheduledCommand)
}

const runSchedule = (client, frequency, name, args, scheduledCommand) => {
  console.log(`Starting scheduler for ${scheduledCommand.id} - ${name} running ${frequency}`)

  const directory = path.resolve(require.main.path, './scheduled')
  const command = require(`${directory}/${name}`)
  const execute = (when, job) => {
    console.log(`[${when}] Running ${name} - ${scheduledCommand.id}`)
    command.execute(client, args, scheduledCommand, job)
  }

  const job = nodeSchedule.scheduleJob(frequency, () => execute('Scheduled', job))
}

const work = (client, prefix = process.env.PREFIX) => {
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
      console.log('====================================')

      DB.init()

      client.user.setPresence({
        status: 'online',
        activity: {
          name: `zug zug ~ ${prefix}help`,
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

  const scheduled = dir => {
    client.on('ready', async () => {
      const scheduledCommands = await ScheduledCommand.query()
      scheduledCommands.forEach(scheduledCommand =>
        runSchedule(client, scheduledCommand.frequency, scheduledCommand.name, scheduledCommand.args, scheduledCommand)
      )
    })
  }

  const listen = () => {
    addListener('message', async message => {
      if (!message.content.startsWith(prefix) || message.author.bot) return

      const args = message.content.slice(prefix.length).trim().split(/ +/)
      const commandName = args.shift().toLowerCase()
      const command =
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

      if (!command) return

      if (message.partial) {
        await message.fetch()
      }

      if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('Me only do that in public')
      }

      if (command.args && !args.length) {
        let reply = `You didn't tell me what to do, me no read minds, ${message.author}!`

        if (command.usage) {
          reply += `\nMe expecting it to be: \`${prefix}${command.name} ${command.usage}\``
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
            `no! me wait ${timeLeft.toFixed(1)} second(s) before listening to \`${command.name}\` again.`
          )
        }
      }

      timestamps.set(message.author.id, now)
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

      try {
        command.execute(message, args, client)
      } catch (error) {
        console.error(error)
        message.reply('Me no work no more!')
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
    scheduled,
    addCommand,
    addListener,
  }
}

// prettier-ignore
const partition = (array, isValid) => {
  return array.reduce(([pass, fail], elem) => {
    return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
  }, [[], []]);
}

// prettier-ignore
const parse = (content, prefix = process.env.PREFIX,seperator = ',') => {
  let [_, ...raw] = content.slice(prefix.length).split(/ +/)
  let [body, tags] = partition(raw, (item) => !item.startsWith('--'))


  let input = body.join(' ').split(seperator).map(section => section.trim())
  let args = tags.reduce((obj, arg) => {
    let [rawKey, value] = arg.split('=')
    let key = rawKey.replace('--', '')

    obj[key] = value

    return obj
  }, {})

  return {
    input,
    args
  }
}

module.exports = {
  work,
  parse,
  say,
  schedule,
}
