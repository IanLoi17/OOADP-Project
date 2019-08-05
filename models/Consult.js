const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Consult = db.define('consult', {
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


module.exports = Consult;