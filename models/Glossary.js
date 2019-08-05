const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Glossary = db.define('glossary',{
    term: {
        type: Sequelize.STRING
    },

    definition: {
        type: Sequelize.STRING
    },
});

module.exports = Glossary;