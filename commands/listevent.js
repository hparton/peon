const Event = require("../db/models/event");

module.exports = {
    name: 'listevent',
    description: 'Find all entries in db',
    async execute(message) {

    // equivalent to: SELECT name FROM events;
    const listEvents = await Event.query()
    .select().table('events')
    
    const data = []

    listEvents.forEach(function (arrayItem) {
        var event = arrayItem.name + arrayItem.date
        data.push(`${event}\n`);
    })

    message.channel.send(`Upcoming events: \n${data.join('')}`);
    }
}