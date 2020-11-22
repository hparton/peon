const peon = require('../src/peon')
const throttle = require('lodash.throttle')
const { stripIndents } = require('common-tags')
const PollResult = require('../db/models/pollResult')
const persist = require('../src/persistantMessage')
const schedule = require('node-schedule')

const uuid = require('uuid')
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
const numberToLetter = v => (v + 10).toString(36)

const render = (question, options, votes) => {
  const total = votes.reduce((total, vote) => total + vote, 0)
  const max = Math.max(...votes)
  const optionsMappedToEmoji = options.map((option, i) => `:regional_indicator_${numberToLetter(i)}: **${option}**`)

  return stripIndents`
        ${question}

        ${optionsMappedToEmoji.join('  |  ')}${
    total > 0
      ? '\n\n' +
        options.map((_, i) => `:regional_indicator_${numberToLetter(i)}: ${votingBar(votes[i], max)}`).join('\n')
      : ''
  }

        _use a reaction below to vote_
    `
}

const percentage = (partialValue, total) => partialValue / total
const scale = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2
const votingBar = (value, total) => {
  const characters = scale(percentage(value, total), 0, 1, 0, 16)
  return '█'.repeat(characters)
}

const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮']

module.exports = {
  name: 'poll',
  args: true,
  usage: '<your description here>, <option 1>, <option 2>, <option 3>, ...',
  description: 'Make a poll',
  async setup(client) {
    const loadPollMessages = async () => {
      const polls = await PollResult.query()

      return await Promise.all(
        polls.map(async poll => {
          const message = await persist.find(client, poll.message_id)

          return {
            poll: poll,
            message: message,
          }
        })
      )
    }

    schedule.scheduleJob('*/30 * * * *', loadPollMessages)

    const pollsWithMessage = await loadPollMessages()
    const throttledEdit = throttle((result, message) => message.edit(result), 1000)

    const updatePoll = async (reaction, user, increment = true) => {
      if (reaction.partial) {
        await reaction.fetch()
      }

      const pls = await loadPollMessages()

      const tmp = pls.find(poll => poll.message.id === reaction.message.id)

      if (tmp) {
        if (
          !(
            tmp.poll.options.map((_, i) => alphabet[i]).includes(reaction.emoji.name) &&
            user.id !== tmp.message.author.id
          )
        ) {
          return
        }

        const voteIndex = alphabet.indexOf(reaction.emoji.name)
        tmp.poll.results[voteIndex] = reaction.emoji.reaction.count - 1

        throttledEdit(render(tmp.poll.question, tmp.poll.options, tmp.poll.results), tmp.message)

        await PollResult.query().where({ id: tmp.poll.id }).patch({
          results: tmp.poll.results,
        })
      }
    }

    client.on('messageReactionAdd', async (reaction, user) => await updatePoll(reaction, user, true))
    client.on('messageReactionRemove', async (reaction, user) => await updatePoll(reaction, user, false))
  },
  async execute(message) {
    const { input, args } = peon.parse(message.content)
    const [question, ...options] = input
    const id = uuid.v4()
    const votes = options.map(() => 0)

    const poll = await message.channel.send(render(question, options, votes))

    await persist.create(id, async () => {
      return poll
    })

    await PollResult.query().insert({
      message_id: id,
      question,
      results: votes,
      options,
    })

    await Promise.all(
      options.map(async (option, i) => {
        return await poll.react(alphabet[i])
      })
    )
  },
}
