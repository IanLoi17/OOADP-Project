const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const Records = require('../models/Records');
const User = require('../models/User');


router.get('/listRecords', ensureAuthenticated, (req, res) => {
    Records.findAll({
        order: [
            ['records', 'ASC']
        ],

        raw: true
    }).then((records) => {
        res.render('./medicalrecords/listRecords', {
            records: records,
        });
    }).catch(err => console.log(err));
});


// Render find patient handlebars
router.get('/findPatient', ensureAuthenticated, (req, res) => {
    res.render('./medicalrecords/findPatient');
});



router.post('/findPatient', (req, res) => {
    let patientid = req.body.patientid; 

    User.findOne({
        where: {
            patientID: patientid
        }
    }).then((user) => {
        if (user) {
            // res.render('medicalrecords/enterRecords', {
            //     user: user
            // });
            
            res.redirect('/records/addRecords');
        }

        else {
            alertMessage(res, 'danger', 'There is no patient found with the ID you entered!', 'fas fa-exclamation-circle', true);
            res.redirect('/records/findPatient');
        }
    }).catch(err => console.log(err));
});



// router.post('/findPatient', (req, res) => {
//     User.findAll({
//         where: {
//             salutation: 'P'
//         }
//     })
//     .then((user) => {
//         let inputID = req.body.patientid;

//         var num = 0;
//         if (user[num].patientID != inputID) {
//             num += 1;
//         }

//         if (user[num].patientID == inputID) {
//             alertMessage(res, 'success', 'Patient with this ID "' + inputID + '" is found!', 'fa fa-check', true);
//             res.render('medicalrecords/enterRecords', {
//                 user: user
//             });
//         }

//         else {
//             alertMessage(res, 'danger', 'Patient with this ID "' + inputID + '" is not found!', 'fas fa-exclamation-circle', true);
//             res.redirect('/records/findPatient');
//         }

//     }).catch((err) => console.log(err));
// })


// Render the add medical records page
router.get('/addRecords', ensureAuthenticated, (req, res) => {
    res.render('./medicalrecords/enterRecords');
});



// Delete medical records for the patient
router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    let userId = req.user.id;
    let recordId = req.params.id;

    Records.findOne({
        where: {
            id: recordId,
            userId: userId
        }
    }).then((record) => {
        if (record != null) {
            Records.destroy({
                where: {
                    id: recordId
                }
            }).then((record) => {
                alertMessage(res, 'danger', 'Medical Record deleted successfully', 'fas fa-trash-alt', true);
                res.redirect('/records/listRecords');
            }).catch(err => console.log(err));
        }

        else {
            alertMessage(res, 'danger', 'Unauthorized access to Medical Record', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    })
});



// Display medical records for the current patient
router.get('/showRecords', ensureAuthenticated, (req, res) => {
    let { name, gender, patientID, nric, mobileNo, housephoneNo, age, height, weight, bloodtype, dateofbirth, drugallergy, majorillness } = req.user;

    Records.findOne({
        where: {
            userId: req.user.id
        }
    }).then((records) => {
        if (drugallergy == '' && majorillness == '') {
            res.render('./medicalrecords/showRecords', {
                records,
                name,
                patientID,
                gender,
                nric,
                mobileNo,
                housephoneNo,
                age,
                height,
                weight,
                bloodtype,
                dateofbirth,                    
                drugallergy: drugallergy = 'None',
                majorillness: majorillness = 'None'
            });
        }

        else if (drugallergy != '' && majorillness == '') {
            res.render('./medicalrecords/showRecords', {
                records,
                name,
                patientID,
                gender,
                nric,
                mobileNo,
                housephoneNo,
                age,
                height,
                weight,
                bloodtype,
                dateofbirth,
                drugallergy,
                majorillness: majorillness = 'None'
            });
        }

        else if (drugallergy == '' && majorillness != '') {
            res.render('./medicalrecords/showRecords', {
                records,
                name,
                patientID,
                gender,
                nric,
                mobileNo,
                housephoneNo,
                age,
                height,
                weight,
                bloodtype,
                dateofbirth,
                drugallergy: drugallergy = 'None',
                majorillness
            });
        }

        else {
            res.render('./medicalrecords/showRecords', {
                records,
                name,
                patientID,
                gender,
                nric,
                mobileNo,
                housephoneNo,
                age,
                height,
                weight,
                bloodtype,
                dateofbirth,
                drugallergy,
                majorillness
            });
        }
    });
});

router.post('/addRecords', (req, res) => {
    let { medicalrecords, information } = req.body;
    let userId = req.user.id;


    if (information != '') {
        Records.create({
            records: medicalrecords,
            information,
            userId
        }).then(() => {
            alertMessage(res, 'success', 'Medical Records added successfully', 'fa fa-check-circle', true);
            res.redirect('/records/listRecords');
        })
            .catch(err => console.log(err));
    }
    
    else {
        Records.create({
            records: medicalrecords,
            information: information = 'None',
            userId
        }).then(() => {
            alertMessage(res, 'success', 'Medical Records added successfully', 'fa fa-check-circle', true);
            res.redirect('/records/listRecords');
        })
            .catch(err => console.log(err));
    }
});


module.exports = router;