const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Consultation = db.define('consultations', {
    patientName: {
        type: Sequelize.STRING
    },

    patientID: {
        type: Sequelize.STRING
    },

    consultation: {
        type: Sequelize.STRING
    }
});


module.exports = Consultation;