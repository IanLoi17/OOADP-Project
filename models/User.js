const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const User = db.define('users',{
    fullname: {
        type: Sequelize.STRING
    },
    NRIC: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING

    },
    DOB: {
        type: Sequelize.DATE

    },
    height: {
        type: Sequelize.DECIMAL

    },
    weight: {
        type: Sequelize.DECIMAL

    },
    blood: {
        type: Sequelize.STRING

    },
    drug_allergy: {
        type: Sequelize.STRING

    },
    major_illness: {
        type: Sequelize.STRING

    }
});

module.exports = User;