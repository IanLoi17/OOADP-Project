const mySQLDB = require('./DBConfig');
const records = require('../models/Records');

// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        console.log('SelfcareRecords database connected');
    })
    .then(() => {
        records;
        mySQLDB.sync({ // Create table if none exists
            force: drop
        }).then(() => {
            console.log('Create tables if none exists');
        })
    })
}

module.exports = {setUpDB};