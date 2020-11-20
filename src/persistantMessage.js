const PersistantMessage = require('../db/models/persistantMessage')

// We won't know the key locally, so we want to remove

const create = async (key, cb) => {
  const messageObj = await cb()

  try {
    const message = await PersistantMessage.query().insert({
      key,
      message_id: messageObj.id,
      channel_id: messageObj.channel.id,
    })

    return messageObj
  } catch (e) {
    console.log(e)
  }
}

const find = async (client, key) => {
  const persistantMessage = await _find(key)

  if (!persistantMessage) {
    return false
  }

  return await client.channels.cache.get(persistantMessage.channel_id).messages.fetch(persistantMessage.message_id)
}

const clear = async key => {
  await Event.query().delete().where({
    key,
  })
}

const _find = async key => {
  return await PersistantMessage.query().where('key', '=', key).first()
}

const _findOrCreate = async message_id => {
  const message = await find(key)

  if (message) {
    return message
  }

  return create(message_id)
}

module.exports = {
  create,
  find,
  clear,
}
