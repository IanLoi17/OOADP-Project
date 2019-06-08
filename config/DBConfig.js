// Bring in Sequelize
const Sequelize = require('sequelize');

// Bring in db.json which contains database name, username and password
const db = require('./db');

// Instantiates Sequelize with database parameters
const sequelize = new Sequelize(db.database, db.username, db.password, {
    host: db.host,
    dialect: 'mysql',
    operatorsAliases: false,

    define: {
        timestamps: false   // Don't create timestamp fields in database
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

module.exports = sequelize;