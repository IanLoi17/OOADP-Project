const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Records = db.define('medicalrecords', {
    records: {
        type: Sequelize.STRING
    },

    information: {
        type: Sequelize.STRING
    }
});

module.exports = Records;