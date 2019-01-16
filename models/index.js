const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Chall = require('./chall')(sequelize, Sequelize);
db.UserChall = require('./userchall')(sequelize, Sequelize);
db.TagChall = require('./tagchall')(sequelize, Sequelize);
db.User.belongsToMany(db.Chall, {through: db.UserChall});
db.Chall.belongsToMany(db.User, {through: db.UserChall});

module.exports = db;
