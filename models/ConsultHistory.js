const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const ConsultHistory = db.define('consulthistory', {
    patientName: {
        type: Sequelize.STRING
    },

    patientID: {
        type: Sequelize.STRING
    },

    consultationDate: {
        type: Sequelize.DATE
    },

    consultation: {
        type: Sequelize.STRING
    }
});


module.exports = ConsultHistory;