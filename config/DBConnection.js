const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const records = require('../models/Records');

// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        console.log('SelfcareRecords database connected');
    })
    .then(() => {
        user.hasMany(records);
        mySQLDB.sync({ // Create table if none exists
            force: drop
        }).then(() => {
            console.log('Create tables if none exists');
        }).catch(err => console.log(err));
    })
    .catch(err => console.log('Error: '+err));
}

module.exports = {setUpDB};