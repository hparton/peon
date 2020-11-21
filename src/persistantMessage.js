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

  try {
    const channel = await client.channels.fetch(persistantMessage.channel_id)
    const message = await channel.messages.fetch(persistantMessage.message_id)
    return message
  } catch (e) {
    console.warn(e)
    _clear(key)
  }
}

const _clear = async key => {
  await PersistantMessage.query().delete().where({
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
  clear: _clear,
}
