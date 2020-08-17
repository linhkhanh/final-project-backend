'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const { applyExtraSetup } = require('./extraSetup');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const modelDefiners = [
	require('./tables/users'),
	require('./tables/transactions'),
  require('./tables/accounts'),
  require('./tables/categories')
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	 modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
