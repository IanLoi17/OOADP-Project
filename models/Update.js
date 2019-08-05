const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Update = db.define('update', {
    patientID: {
        type: Sequelize.STRING
    },

    patientName:{
        type: Sequelize.STRING
    },

    dateOfUpdate: {
        type: Sequelize.DATE
    },
    
    updateTitle: {
        type: Sequelize.STRING
    },
    
    updateContent: {
        type: Sequelize.STRING(2000)
        }
});
module.exports = Update;