const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Records = db.define('medicalrecords', {
    records: {
        type: Sequelize.STRING(8000)
    },

    information: {
        type: Sequelize.STRING(8000)
    },

    patientID: {
        type: Sequelize.STRING
    },

    dateposted: {
        type: Sequelize.DATE
    },
});

module.exports = Records;