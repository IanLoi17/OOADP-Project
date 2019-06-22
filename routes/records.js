const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const Records = require('../models/Records');
const User = require('../models/User');


router.get('/listRecords', ensureAuthenticated, (req, res) => {
    Records.findAll({
        where: {
            userId: req.user.id
        },

        order: [
            ['records', 'ASC']
        ],

        raw: true
    })
    .then((records) => {
        res.render('medicalrecords/listRecords', {
            records: records
        });
    })
    .catch(err => console.log(err));
});

router.get('/addRecords', ensureAuthenticated, (req, res) => {
    res.render('./medicalrecords/enterRecords');
});


// Display medical records for the current patient
router.get('/showRecords', ensureAuthenticated, (req, res) => {
    let name = 'John Tan';
    let age = 19;
    let height = '1.72';
    let weight = '58.7';
    let gender = 'M';
    let bloodtype = 'O';
    let dateofbirth = '12/06/2000';
    let drugallergy = 'Sofidroux antibiotic';
    let majorillness = 'None';

    res.render('./medicalrecords/displayRecords', {
        name: name,
        age: age,
        height: height,
        weight: weight,
        gender: gender,
        bloodtype: bloodtype,
        dateofbirth: dateofbirth,
        drugallergy: drugallergy,
        majorillness: majorillness
    });
});

router.post('/addRecords', (req, res) => {
    let medicalrecords = req.body.medicalrecords;
    let information = req.body.information;
    let userId = req.user.id

    Records.create({
        records: medicalrecords,
        information,
        userId
    }) .then((record) => {
        alertMessage(res, 'success', 'Medical Records added successfully', 'fa fa-check-circle', true);
        res.redirect('/records/listRecords');
    })
    .catch(err => console.log(err));
});


module.exports = router;