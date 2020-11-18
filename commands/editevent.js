const { Events } = require("../db/events");

const stringToDate = (str) => {
    var date = str.split("-"),
        m = date[0],
        d = date[1],
        y = date[2];
    return (new Date(y + "-" + m + "-" + d)).toUTCString();
  }

module.exports = {
    name: 'editevent',
    description: 'Update entry in db',
    execute(message) {

        const input = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const command = input.shift().toLowerCase();

        const tagEvent = input[0];
        const tagDate = input[1];
        const tagDescription = input[2];

        // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
        const affectedRows = Events.update({ 
            date: tagDate,
            description: tagDescription
         }, { where: { event: tagEvent } });
        if (affectedRows > 0) {
            return message.reply(`Event ${tagEvent} was updated.`);
        }
        return message.reply(`Could not find an event with name ${tagEvent}.`);
    }
}