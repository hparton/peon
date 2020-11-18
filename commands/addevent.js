const { Events } = require("../db/events");

const stringToDate = (str) => {
    var date = str.split("-"),
        m = date[0],
        d = date[1],
        y = date[2];
    return (new Date(y + "-" + m + "-" + d)).toUTCString();
  }

module.exports = {
    name: 'addevent',
    description: 'Adding entry in db',
    execute(message) {

        const data = []

        const input = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const command = input.shift().toLowerCase();

        const tagEvent = input[0];
        const tagDate = input[1];
        const tagDescription = input[2];

        if (!input.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        data.push(`Adding event for:`);
        data.push(`Event: ${tagEvent}`);
        data.push(`Date: ${tagDate}`);
        data.push(`Description: ${tagDescription}`);

        message.channel.send(data, { split: true })

        try {
            // equivalent to: INSERT INTO tags (name, description, event, username) values (?, ?, ?);
            const event = Events.create({
                event: tagEvent,
                date: stringToDate(tagDate),
                description: tagDescription,
                created_by: message.author.username
            });
            return message.reply(`Event "${tagEvent}" added.`);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That event already exists.');
            }
            return message.reply('Something went wrong with adding the event.');
        }
    }
}