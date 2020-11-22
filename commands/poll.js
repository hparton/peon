const peon = require('../src/peon')
const throttle = require('lodash.throttle')
const { stripIndents } = require('common-tags')

// const question = ['What days do you guys think we should raid?']
// const options = ['Monday', 'Tuesday', 'Wednesday', 'Thursday']

// maybe try this with a db table of poll messages that expire after a defined time.
// check if reaction.message.id matches so rebooting the bot won't break reactions.
// client.on('messageReactionAdd', (reaction, user) => {
//   console.log(`${user.username} reacted with ${reaction.emoji.name}`)
// })
//       if (reaction.partial) {
//     console.log()
//     await reaction.fetch()
//   }

const percentage = (partialValue, total) => partialValue / total
const scale = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2
const numberToLetter = v => (v + 10).toString(36)
const votingBar = (value, total) => {
  const characters = scale(percentage(value, total), 0, 1, 0, 20)
  return '█'.repeat(characters)
}

const alphabet = {
  a: '🇦',
  b: '🇧',
  c: '🇨',
  d: '🇩',
  e: '🇪',
  f: '🇫',
  g: '🇬',
  h: '🇭',
  i: '🇮',
}

module.exports = {
  name: 'poll',
  args: true,
  usage: '<your description here>, <option 1>, <option 2>, <option 3>, ...',
  description: 'Make a poll',
  async execute(message) {
    const { input, args } = peon.parse(message.content)
    const [question, ...options] = input
    const optionsMappedToEmoji = options.map((option, i) => `:regional_indicator_${numberToLetter(i)}: **${option}**`)

    const filter = (reaction, user) => {
      return (
        options.map((_, i) => alphabet[numberToLetter(i)]).includes(reaction.emoji.name) && user.id !== poll.author.id
      )
    }

    const votes = options.reduce((obj, option, i) => {
      obj[alphabet[numberToLetter(i)]] = 0
      return obj
    }, {})

    const totalVotes = votes => {
      return Object.values(votes).reduce((total, vote) => total + vote, 0)
    }

    const render = votes => {
      const total = totalVotes(votes)
      return stripIndents`
        ${question}

        ${optionsMappedToEmoji.join('  |  ')}${
        total > 0
          ? '\n\n' +
            options
              .map(
                (options, i) =>
                  `:regional_indicator_${numberToLetter(i)}: ${votingBar(votes[alphabet[numberToLetter(i)]], total)}`
              )
              .join('\n')
          : ''
      }

        _use a reaction below to vote_
    `
    }

    const poll = await message.channel.send(render(votes))
    const collector = poll.createReactionCollector(filter, { dispose: true })
    const throttledEdit = throttle(result => poll.edit(result), 1000)

    collector.on('collect', async (reaction, user) => {
      if (reaction.partial) {
        console.log('[Partial] Got a partial reaction, resolving before continuing.')
        await reaction.fetch()
      }

      votes[reaction.emoji.name]++
      throttledEdit(render(votes))
    })

    collector.on('remove', async (reaction, user) => {
      if (reaction.partial) {
        console.log('[Partial] Got a partial reaction, resolving before continuing.')
        await reaction.fetch()
      }

      votes[reaction.emoji.name]--
      throttledEdit(render(votes))
    })

    await Promise.all(
      options.map(async (option, i) => {
        return await poll.react(alphabet[numberToLetter(i)])
      })
    )
  },
}
