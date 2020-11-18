const Sequelize = require('sequelize');

const sequelize = new Sequelize('birthdays', 'overlord', 'occifer4life', {
	host: 'localhost',
	dialect: 'sqlite',
	// SQLite only
	storage: 'database.sqlite',
})
	
const Birthdays = sequelize.define('Birthdays', {
	date: Sequelize.DATE,
	username: Sequelize.STRING
})

module.exports = {
	Birthdays
}