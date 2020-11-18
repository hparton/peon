// const peon = require('../src/peon')

// const tag = () => {
//     ('message', async message => {
//         if (message.content.startsWith(process.env.PREFIX)) {
//         else if (command === 'tag') {
//             const tagEvent = commandArgs;

//             // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
//             const tag = await Tags.findOne({ where: { event: tagEvent } });
//             if (tag) {
//             // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
//             tag.increment('usage_count');
//             return message.channel.send(tag.get('description'));
//             }
//             return message.reply(`Could not find tag: ${tagEvent}`);
//         } else if (command === 'edittag') {
//             const splitArgs = commandArgs.split(' ');
//             const tagEvent = splitArgs.shift();
//             const tagDescription = splitArgs.join(' ');
            
//             // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
//             const affectedRows = await Tags.update({ description: tagDescription }, { where: { event: tagEvent } });
//             if (affectedRows > 0) {
//             return message.reply(`Tag ${tagEvent} was edited.`);
//             }
//             return message.reply(`Could not find a tag with name ${tagEvent}.`);
//         } else if (command === 'taginfo') {
//             const tagEvent = commandArgs;

//             // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
//             const tag = await Tags.findOne({ where: { event: tagEvent } });
//             if (tag) {
//             return message.channel.send(`${tagEvent} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
//             }
//             return message.reply(`Could not find tag: ${tagEvent}`);
//         } else if (command === 'showtags') {
//             // equivalent to: SELECT name FROM tags;
//             const tagList = await Tags.findAll({ attributes: ['event'] });
//             const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
//             return message.channel.send(`List of tags: ${tagString}`);
//         } else if (command === 'removetag') {
//             const tagEvent = commandArgs;
//             // equivalent to: DELETE from tags WHERE name = ?;
//             const rowCount = await Tags.destroy({ where: { event: tagEvent } });
//             if (!rowCount) return message.reply('That tag did not exist.');
//             return message.reply('Tag deleted.');
//         }
//         }
//     })
// }

// module.exports = {
//     tag
// }