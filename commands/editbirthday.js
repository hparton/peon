const { Birthdays } = require("../db/birthdays");

const stringToDate = (str) => {
    var date = str.split("-"),
        m = date[0],
        d = date[1],
        y = date[2];
    return (new Date(y + "-" + m + "-" + d)).toUTCString();
  }

module.exports = {
    name: 'editbirthday',
    description: 'Update entry in db',
    execute(message) {

        const input = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const command = input.shift().toLowerCase();

        const tagDate = input[0];
        const tagUser = input[1];

        // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
        const affectedRows = Birthdays.update({ date: tagDate }, { where: { username: tagUser } });
        if (affectedRows > 0) {
            return message.reply(`Birthday ${tagUser} was updated.`);
        }
        return message.reply(`Could not find a birthday with name ${tagUser}.`);
    }
}