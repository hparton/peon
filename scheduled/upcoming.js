const persist = require('../src/persistantMessage')
const calendar = require('../src/calendar')
const ScheduledCommand = require('../db/models/scheduledCommand')

module.exports = {
  name: 'upcoming',
  description: 'doot doot',
  async execute(client, { id }, scheduledCommand, job) {
    const data = await calendar.upcoming()

    let existingMessage = await persist.find(client, id)

    if (existingMessage) {
      existingMessage.edit(data)
      return
    } else {
      console.log(`Can't find the message, stopping job: ${scheduledCommand.id}`)
      await ScheduledCommand.query().deleteById(scheduledCommand.id)

      if (job) {
        job.cancel()
      }
    }
  },
}
