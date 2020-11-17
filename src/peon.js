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
  let commands = {}

  const init = () => {
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

    client.login('Nzc4Mjk2MTQ2ODI4NDYwMDc4.X7P6xQ.2GE0bWFde0R0fvvj_SYPbICNU6E')

    addCommand('!help', 'me help', message => {
      message.author.send(_commands())
    })
  }

  const addCommand = (key, description, cb) => {
    commands[key] = description
    client.on('message', (message, ...args) => {
      if (message.content.includes(key) && message.author.id !== client.user.id) {
        cb(message, ...args)
      }
    })
  }

  const addListener = (key, cb) => {
    client.on(key, cb)
  }

  const _commands = () => {
    return Object.keys(commands).reduce((prev, key) => `${prev}\`${key}\`: ${commands[key]}\n`, '')
  }

  return {
    client,
    init,
    addCommand,
    addListener,
  }
}

module.exports = {
  work,
  say,
}
