require('dotenv').config();

module.exports = {
    development: {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'ctf_review',
        host: '127.0.0.1',
        dialect: 'mysql',
        operatorAliases: 'false',
    }
}