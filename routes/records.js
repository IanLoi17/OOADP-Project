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
            let { name, age, height, weight, bloodtype, dateofbirth, drugallergy, majorillness } = req.user;

            res.render('medicalrecords/listRecords', {
                records: records,
                name: name,
                age: age,
                height: height,
                weight: weight,
                bloodtype: bloodtype
            });
        })
        .catch(err => console.log(err));
});

router.get('/addRecords', ensureAuthenticated, (req, res) => {
    let { name, age, height, weight, bloodtype, dateofbirth, drugallergy, majorillness } = req.user;

    res.render('./medicalrecords/enterRecords', {
        name: name,
        age: age,
        height: height,
        weight: weight,
        bloodtype: bloodtype
    });
});


// Display medical records for the current patient
router.get('/showRecords', ensureAuthenticated, (req, res) => {
    let { name, gender, patientID, nric, age, height, weight, bloodtype, dateofbirth, drugallergy, majorillness } = req.user;

    Records.findOne({
        where: {
            userId: req.user.id
        }
    }).then((records) => {
        if (drugallergy == '' && majorillness == '') {
            res.render('./medicalrecords/showRecords', {
                records: records,
                name: name,
                patientID: patientID,
                gender: gender,
                nric: nric,
                age: age,
                height: height,
                weight: weight,
                bloodtype: bloodtype,
                dateofbirth: dateofbirth,                    
                drugallergy: drugallergy = 'None',
                majorillness: majorillness = 'None'
            });
        }

        else if (drugallergy != '' && majorillness == '') {
            res.render('./medicalrecords/showRecords', {
                records: records,
                name: name,
                patientID: patientID,
                gender: gender,
                nric: nric,
                age: age,
                height: height,
                weight: weight,
                bloodtype: bloodtype,
                dateofbirth: dateofbirth,
                drugallergy: drugallergy,
                majorillness: majorillness = 'None'
            });
        }

        else if (drugallergy == '' && majorillness != '') {
            res.render('./medicalrecords/showRecords', {
                records: records,
                name: name,
                patientID: patientID,
                gender: gender,
                nric: nric,
                age: age,
                height: height,
                weight: weight,
                bloodtype: bloodtype,
                dateofbirth: dateofbirth,
                drugallergy: drugallergy = 'None',
                majorillness: majorillness
            });
        }

        else {
            res.render('./medicalrecords/showRecords', {
                records: records,
                name: name,
                patientID: patientID,
                gender: gender,
                nric: nric,
                age: age,
                height: height,
                weight: weight,
                bloodtype: bloodtype,
                dateofbirth: dateofbirth,
                drugallergy: drugallergy,
                majorillness: majorillness
            });
        }
    });
});

router.post('/addRecords', (req, res) => {
    let { medicalrecords, information } = req.body;
    let userId = req.user.id

    Records.create({
        records: medicalrecords,
        information,
        userId
    }).then((record) => {
        alertMessage(res, 'success', 'Medical Records added successfully', 'fa fa-check-circle', true);
        res.redirect('/records/listRecords');
    })
        .catch(err => console.log(err));
});


module.exports = router;