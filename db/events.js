const Sequelize = require('sequelize');

const sequelize = new Sequelize('events', 'overlord', 'occifer4life', {
	host: 'localhost',
	dialect: 'sqlite',
	// SQLite only
	storage: 'database.sqlite',
})
	
const Events = sequelize.define('Events', {
	event: Sequelize.STRING,
	date: Sequelize.DATE,
	description: Sequelize.TEXT,
	created_by: Sequelize.STRING
})

module.exports = {
	Events
}