const peon = require('../src/peon')
const throttle = require('lodash.throttle')
const { stripIndents } = require('common-tags')

// const question = ['What days do you guys think we should raid?']
// const options = ['Monday', 'Tuesday', 'Wednesday', 'Thursday']

const percentage = (partialValue, total) => partialValue / total
const scale = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2

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
  description: 'Make a poll',
  async execute(message) {
    const { input, args } = peon.parse(message.content)
    const [question, ...options] = input

    const filter = (reaction, user) => {
      return (
        options.map((_, i) => alphabet[numberToLetter(i)]).includes(reaction.emoji.name) &&
        user.id !== message.client.user.id
      )
    }

    const numberToLetter = v => (v + 10).toString(36)
    const votingBar = (value, total) => {
      const characters = scale(percentage(value, total), 0, 1, 0, 20)
      return '█'.repeat(characters)
    }
    const optionsMappedToEmoji = options.map((option, i) => `:regional_indicator_${numberToLetter(i)}: **${option}**`)

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

    collector.on('collect', (reaction, user) => {
      votes[reaction.emoji.name]++
      throttledEdit(render(votes))
    })

    collector.on('remove', (reaction, user) => {
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

// █

// format
// What days do you guys think we should raid?

// :regional_indicator_a: **Monday**  |  :regional_indicator_b:  **Tuesday**  |  :regional_indicator_c: **Wednesday** |  :regional_indicator_d:  **Thursday**

// :regional_indicator_a:  ███████████████████
// :regional_indicator_b:  ███████████
// :regional_indicator_c:  ██████
// :regional_indicator_d:  ███████████████
// _use a reaction below to vote, voting closes in 24 hours_
