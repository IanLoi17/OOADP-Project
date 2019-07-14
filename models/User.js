const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const User = db.define('users',{
    name: {
        type: Sequelize.STRING
    },

    occupation: {
        type: Sequelize.STRING
    },

    patientID: {
        type: Sequelize.STRING
    },

    salutation: {
        type: Sequelize.STRING
    },

    nric: {
        type: Sequelize.STRING
    },

    email: {
        type: Sequelize.STRING
    },

    password: {
        type: Sequelize.STRING
    },

    age: {
        type: Sequelize.INTEGER
    },

    mobileNo: {
        type: Sequelize.INTEGER
    },

    housephoneNo: {
        type: Sequelize.INTEGER
    },
    
    gender: {
        type: Sequelize.STRING
    },

    dateofbirth: {
        type: Sequelize.DATE
    },

    height: {
        type: Sequelize.DECIMAL(10, 2)

    },

    weight: {
        type: Sequelize.DECIMAL(10, 1)

    },

    bloodtype: {
        type: Sequelize.STRING

    },

    drugallergy: {
        type: Sequelize.STRING(5000)

    },

    majorillness: {
        type: Sequelize.STRING(5000)
    }
});

module.exports = User;