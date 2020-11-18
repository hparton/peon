const { Birthdays } = require("../db/birthdays");

const stringToDate = (str) => {
    var date = str.split("-"),
        m = date[0],
        d = date[1],
        y = date[2];
    return (new Date(y + "-" + m + "-" + d)).toUTCString();
  }

module.exports = {
    name: 'addbirthday',
    description: 'Adding entry in db',
    execute(message) {

        const input = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const command = input.shift().toLowerCase();

        const tagDate = input[0];
        const tagUser = input[1];

        if (!input.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        message.channel.send(`Adding birthday for:`);
        message.channel.send(`Date: ${tagDate}`);
        message.channel.send(`Who: ${tagUser}`);

        try {
            // equivalent to: INSERT INTO tags (name, description, event, username) values (?, ?, ?);
            const birthday = Birthdays.create({
                date: stringToDate(tagDate),
                username: tagUser
            });
            return message.reply(`Birthday for "${tagUser}" on "${tagDate}" added`);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That user already has a birthday.');
            }
            return message.reply('Something went wrong with adding the birthday.');
        }
    }
}