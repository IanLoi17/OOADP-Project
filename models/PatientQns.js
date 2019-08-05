const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const PatientQns = db.define('PatientQns', {
    patientID: {
        type: Sequelize.STRING
    },

    patientName: {
        type: Sequelize.STRING
    },

    consultationDate: {
        type: Sequelize.DATE
    },

    reasonForEnquiry: {
        type: Sequelize.STRING
    },

    enquiryContent: {
        type: Sequelize.STRING(2000)
    }
});


module.exports = PatientQns;