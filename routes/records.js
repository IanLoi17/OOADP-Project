const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const moment = require('moment');
const Records = require('../models/Records');
const User = require('../models/User');
const Consult = require('../models/Consult');
const ConsultHistory = require('../models/ConsultHistory');


// Render medical records list
router.get('/listRecords', ensureAuthenticated, (req, res) => {
    if (req.user.salutation == 'D') {
        Records.findAll({
            order: [
                ['records', 'ASC']
            ],

            raw: true
        }).then((records) => {
            res.render('./records/listRecords', {
                records: records,
            });
        }).catch(err => console.log(err));
    }

    else {
        alertMessage(res, 'danger', 'Unauthorized access! Only Doctors can access the link', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    }
});


// Render consultation history handlebars
router.get('/consultHistory', ensureAuthenticated, (req, res) => {
    if (req.user.salutation == 'D') {
        ConsultHistory.findAll({
            where: {}
        }).then((consulthistory) => {
            res.render('./records/consultHistory', {
                consulthistory,
            });
        }).catch(err => console.log(err))
    }

    else {
        alertMessage(res, 'danger', 'Unauthorized access! Only Doctors can access to the link', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    }
});



// Render consultation reason handlebars
router.get('/enterConsultation', ensureAuthenticated, (req, res) => {
    User.findOne({
        where: {
            patientID: req.user.patientID
        }
    }).then((user) => {
        res.render('./records/enterConsultation', {
            user: user
        });
    }).catch(err => console.log(err))
});



router.post('/enterConsultation', (req, res) => {
    let patientName = req.body.patientName;
    let patientID = req.body.patientID;
    let consultation = req.body.consultationDetails;
    let consultationDate = moment(req.body.consultationDate, 'DD/MM/YYYY');
    let currentDate = moment();
    let diffDays = consultationDate.diff(currentDate, 'days');
    console.log(diffDays);


    Consult.findOne({
        where: {
            patientID: req.user.patientID
        }
    }).then((consult) => {
        if (consult) {
            alertMessage(res, 'danger', 'You can only only enter consultation records once! Please edit or delete your consultation', 'fa fa-info-circle', true);
            res.redirect('/records/enterConsultation');
        }

        else {
            if (diffDays < 0) {
                alertMessage(res, "danger", "Your consultation date cannot be before today's date!", "fa fa-info-circle", true);
                res.redirect('/records/enterConsultation');
            }

            else if (diffDays > 0) {
                alertMessage(res, "danger", "Your consultation date cannot be after today's date", "fas fa-exclamation-circle", true);
                res.redirect('/records/enterConsultation');
            }

            else {
                Consult.create({
                    patientName,
                    patientID,
                    consultation,
                    consultationDate,
                });

                ConsultHistory.create({
                    patientName,
                    patientID,
                    consultation,
                    consultationDate,
                });
    
                alertMessage(res, 'success', 'Consultation reocrds have been added successfully!', 'fa fa-check-circle', true);
                res.redirect('/');
            }
        }
    }).catch(err => console.log(err))
})


router.get('/updateConsultation/:id', ensureAuthenticated, (req, res) => {
    Consult.findOne({
        where: {
            id: req.params.id
        }
    }).then((consult) => {
        User.findOne({
            where: {
                patientID: consult.patientID
            }
        }).then((user) => {
            if (!consult) {
                alertMessage(res, 'danger', 'There is no such consultation reocrds!', 'fas fa-exclamation-circle', true);
                res.redirect('/records/showRecords');
            }

            else {
                if (req.user.patientID === consult.patientID) {
                    res.render('./records/updateConsultation', {
                        consult,
                        user
                    });
                }

                else {
                    alertMessage(res, 'danger', 'Unauthorized access to Consultation Records!', 'fas fa-exclamation-circle', true);
                    res.redirect('/');
                }
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
});


router.put('/saveUpdatedConsultation/:id', ensureAuthenticated, (req, res) => {
    let patientName = req.body.patientName;
    let patientID = req.body.patientID;
    let consultation = req.body.consultationDetails;
    let consultationDate = moment(req.body.consultationDate, 'DD/MM/YYYY');
    let currentDate = moment();
    let diffDays = consultationDate.diff(currentDate, 'days');
    console.log(diffDays);

    ConsultHistory.create({
        patientName,
        patientID,
        consultation,
        consultationDate
    });

    Consult.update({
        patientName,
        patientID,
        consultation,
        consultationDate
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        if (diffDays < 0) {
            alertMessage(res, "danger", "Your consultation date cannot be before today's date!", "fa fa-info-circle", true);
            res.redirect('/records/updateConsultation/:id');
        }

        else if (diffDays > 0) {
            alertMessage(res, "danger", "Your consultation date cannot be before today's date!", "fas fa-exclamation-circle", true);
            res.redirect('/records/updateConsultation/:id');
        }

        else {
            alertMessage(res, 'success', 'Consultation Records have been updated successfully!', 'fa fa-check-circle', true);
            res.redirect('/');
        }
    }).catch(err => console.log(err))
});



router.get('/deleteConsultation/:id', ensureAuthenticated, (req, res) => {
    let patientID = req.user.patientID;
    let consultationID = req.params.id;

    Consult.findOne({
        where: {
            id: consultationID,
            patientID: patientID
        }
    }).then((consult) => {
        if (consult != null) {
            Consult.destroy({
                where: {
                    id: consultationID
                }
            }).then(() => {
                alertMessage(res, 'danger', 'Consultation Records deleted successfully', 'fas fa-trash-alt', true);
                res.redirect('/');
            }).catch(err => console.log(err))
        }
    }).catch(err => console.log(err))
});


// Render the add medical records page
router.get('/addRecords', ensureAuthenticated, (req, res) => {
    if (req.user.salutation == 'D') {
        User.findAll({
            where: {
                salutation: 'P'
            }
        }).then((users) => {
            Consult.findAll({
                where: {}
            }).then((consults) => {
                res.render('./records/enterRecords', {
                    users: users,
                    consults
                });
            })
        }).catch(err => console.log(err));
    }


    else {
        alertMessage(res, 'danger', 'Unauthorized access! Only Doctors can access the link', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    }
});


// Delete medical records for the patient
router.get('/deleteRecords/:id', ensureAuthenticated, (req, res) => {
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
            }).then(() => {
                alertMessage(res, 'danger', 'Medical Record deleted successfully', 'fas fa-trash-alt', true);
                res.redirect('/records/listRecords');
            }).catch(err => console.log(err));
        }

        else {
            alertMessage(res, 'danger', 'Unauthorized access to Medical Record', 'fas fa-exclamation-circle', true);
            res.redirect('/records/listRecords');
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
    }).then((record) => {
        Consult.findOne({
            where: {
                patientID: req.user.patientID
            }
        }).then((consult) => {
            res.render('./records/showRecords', {
                record,
                consult,
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
        })
    }).catch(err => console.log(err))
});


// Render update medical records page
router.get('/updateRecords/:id', ensureAuthenticated, (req, res) => {
    Records.findOne({
        where: {
            id: req.params.id
        }
    }).then((record) => {
        User.findOne({
            where: {
                patientID: record.patientID
            }
        }).then((user) => {
            if (!record) {
                alertMessage(res, 'danger', 'No such medical records found!', 'fas fa-exclamation-circle', true);
                res.redirect('/records/listRecords');
            }
    
            else {
                if (req.user.id === record.userId) {
                    res.render('./records/updateRecords', {
                        record: record,
                        user: user
                    })
                }
    
                else {
                    alertMessage(res, 'danger', 'Unauthorizeed access to medical records!', 'fas fa-exclamation-circle', true);
                    res.redirect('/');
                }
            }
        })
    }).catch(err => console.log(err));
});



// Save updated medical records of patient
router.put('/saveUpdatedRecords/:id', ensureAuthenticated, (req, res) => {
    let {patientID, patientName, medicalrecords, information} = req.body;
    let userId = req.user.id;
    var d = new Date();
    let dateposted = d.toLocaleDateString();

    
    if (information != '') {
        Records.update({
            records: medicalrecords,
            information,
            patientID: patientID,
            patientName,
            userId,
            dateposted: dateposted
        }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Medical Records updated successfully', 'fa fa-check-circle', true);
            res.redirect('/records/listRecords');
        }).catch(err => console.log(err));
    }

    else {
        Records.update({
            records: medicalrecords,
            information: information="None",
            patientID: patientID,
            patientName,
            userId,
            dateposted: dateposted
        }).then(() => {
            alertMessage(res, 'success', 'Medical Records updated successfully', 'fa fa-check-circle', true);
            res.redirect('/records/listRecords');
        }).catch(err => console.log(err));
    }
});



router.post('/addRecords', (req, res) => {
    let { patientID, medicalrecords, patientName, information } = req.body;
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
                    patientName,
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
                    patientName,
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