const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const Records = require('../models/Records');
const User = require('../models/User');
const moment = require('moment');


// Render medical records list
router.get('/listRecords', ensureAuthenticated, (req, res) => {
    if (req.user.salutation == 'D') {
        Records.findAll({
            order: [
                ['records', 'ASC']
            ],

            raw: true
        }).then((records) => {
            // User.findOne({
            //     where: {
            //         patientID: 'T0117430J'
            //     }
            // }).then((user) => {
            //     res.render('./medicalrecords/listRecords', {
            //         records: records,
            //     });
            // })

            res.render('./records/listRecords', {
                records: records,
            });
        }).catch(err => console.log(err));
    }

    else {
        alertMessage(res, 'danger', 'You are not a Doctor you cannot access this link!', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    }
});


// Render find patient handlebars
router.get('/findPatient', ensureAuthenticated, (req, res) => {
    if (req.user.salutation == 'D') {
        User.findAll({
            where: {
                salutation: 'P'
            }
        }).then((user) => {
            res.render('./records/findPatient', {
                user: user
            });
        }).catch(err => console.log(err));
    }

    else {
        alertMessage(res, 'danger', 'You are not a Doctor you cannot access this link!', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    }
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

            alertMessage(res, 'success', 'Patient ' + user.name + ' with patient ID "' + patientid + '" has been found!', 'fa fa-check-circle', true);
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
// });


// Render the add medical records page
router.get('/addRecords', ensureAuthenticated, (req, res) => {
    if (req.user.salutation == 'D') {
        User.findOne({
            where: {
                patientID: 'T0117430J'
            }
        }).then((user) => {
            res.render('./records/enterRecords', {
                user: user
            });
        }).then(err => console.log(err));
    }


    else {
        alertMessage(res, 'danger', 'You are not a Doctor you cannot access this link!', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    }
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
            patientID: req.user.patientID
        }
    }).then((records) => {
        res.render('./records/showRecords', {
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
    });
});

router.post('/addRecords', (req, res) => {
    let { patientID, medicalrecords, information } = req.body;
    let userId = req.user.id;
    var d = new Date();
    let dateposted = d.toLocaleDateString();


    if (information != '') {
        Records.findOne({where: 
            {patientID: req.body.patientID}
        }).then((records) => {
            if (records) {
                alertMessage(res, 'danger', 'Patient with the ID "' + patientID + '" already has Medical Records', 'fa fa-info-circle', true);
                res.redirect('/records/addRecords');
            }

            else {
                Records.create({
                    records: medicalrecords,
                    information,
                    patientID: patientID,
                    userId,
                    dateposted: dateposted
                }).then(() => {
                    alertMessage(res, 'success', 'Medical Records added successfully', 'fa fa-check-circle', true);
                    res.redirect('/records/listRecords');
                })
                    .catch(err => console.log(err));
            }
        }).catch(err => console.log(err));
    }

    else {
        Records.findOne({where: 
            {patientID: req.body.patientID}
        }).then((records) => {
            if (records) {
                alertMessage(res, 'danger', 'Patient with the ID "' + patientID + '" already has Medical Records', 'fa fa-info-circle', true);
                res.redirect('/records/addRecords');
            }
            
            else {
                Records.create({
                    records: medicalrecords,
                    information: information = 'None',
                    patientID: patientID,
                    userId,
                    dateposted: dateposted
                }).then(() => {
                    alertMessage(res, 'success', 'Medical Records added successfully', 'fa fa-check-circle', true);
                    res.redirect('/records/listRecords');
                })
                    .catch(err => console.log(err));
            }
        }).catch(err => console.log(err));
    }
});


module.exports = router;