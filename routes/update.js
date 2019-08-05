const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Update = require('../models/Update');
const User = require('../models/User');
const PatientQns = require('../models/PatientQns');

// only DOCTORS may access these pages 

router.get('/EnquiryForm', ensureAuthenticated, (req, res) => {
    User.findOne({
        where: {
            patientID: req.user.patientID
        }
    }).then((user) => {
        res.render('medicalupdate/enquiryForm', {
            user
        });
    }).catch(err => console.log(err));
});

router.post('/EnquiryForm', (req, res) => {
    let patientID = req.body.patientID;
    let enquiryContent = req.body.enquiryContent;
    let patientName = req.body.patientName;
    let reasonForEnquiry = req.body.visitReason;
    let consultationDate = moment(req.body.consultationDate, 'DD/MM/YYYY');
    // Create new update record
    PatientQns.create({
        patientID, //patientID is the nric of the patient
        patientName,
        consultationDate,
        reasonForEnquiry,
        enquiryContent
    })
        .then((enquiry) => {
            res.redirect('./EnquiryForm')
        })
        .catch(err => console.log(err));
});


router.get('/showupdateForm', ensureAuthenticated, (req, res) => {
    if (req.user.salutation == 'D') {
        Update.findAll({
            order: [
                ['id', 'ASC']
            ],

            raw: true
        }).then((updates) => {
            User.findAll({
                order: [
                    ['name', 'ASC']
                ],

                raw: true
            }).then((users) => {
                PatientQns.findAll({
                    order: [
                        ['id', 'ASC']
                    ],

                    raw: true
                }).then((enquiry) => {
                    res.render('medicalupdate/updateForm', {
                        updates: updates,
                        users: users,
                        enquiry: enquiry
                        
                    });
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        })
    }

    else {
        alertMessage(res, 'danger', 'Unauthorized access! Only Doctors can access the link', 'fa fa-info-circle', true);
        res.redirect('/');
    }
});

router.get('/showupdateFeed', ensureAuthenticated, (req, res) => {

    Update.findAll({
        order: [
            ['patientName', 'ASC']
        ],
        raw: true
        //include: [ {model: User} ]n
    }).then((updates) => {
        res.render('medicalupdate/updateFeed', { // pass object to listVideos.handlebar
            updates
        });
    }).catch(err => console.log(err));
});
// User register URL using HTTP post => /user/register
router.post('/showupdateForm', (req, res) => {

    // Retrieves fields from update form page
    let patientID = req.body.patientID;
    let updateTitle = req.body.updateTitle;
    let updateContent = req.body.updateContent;
    let patientName = req.body.patientName;
    let treatmentDate = req.body.treatmentDate;
    // Create new update record
    Update.create({
        patientID: patientID, //patientID is the nric of the patient
        patientName: patientName,
        dateOfUpdate: treatmentDate,
        updateTopic: updateTitle, //enquiry of patient
        updateContent: updateContent
    })
        .then((update) => {
            res.redirect('./showupdateFeed')
        })
        .catch(err => console.log(err));
});

router.get('/edit/:id', (req, res) => {
    //console.log(`+++++++++++++++ Current user id: ${req.user.id}`);
    Update.findOne({
        where: {
            id: req.params.id
        }
    }).then((update) => {
        if (!update) { // check video first because it could be null.
            console.log("No such Update");
            res.redirect('./showupdateFeed');
        } else {
            
            res.render('medicalupdate/editUpdate', { // call views/video/editVideo.handlebar to render the edit video page
                update
            });

        }
    }).catch(err => console.log(err)); // To catch no update ID
});

// save edited video
router.put('/saveEditedUpdate/:id', (req, res) => {
    let patientID = req.body.patientID;
    let updateTitle = req.body.updateTitle;
    let updateContent = req.body.updateContent;
    let patientName = req.body.patientName;
    let treatmentDate = req.body.treatmentDate;


	/* console.log(`\n++++++++ Video from session: ${req.session.video.title}`);
	 console.log(`\n++++++++ All videos from session: ${req.session.allVideos}`); */
    console.log(`NRIC: ${patientID}`);
    Update.update({
        patientID: patientID, //patientID is the nric of the patient
        patientName: patientName,
        dateOfUpdate: treatmentDate,
        updateTopic: updateTitle, //enquiry of patient
        updateContent: updateContent
    }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.redirect('/update/showupdateFeed'); // redirect to call router.get(/listVideos...) to retrieve all updated
            // videos
        }).catch(err => console.log(err));
});

router.get('/delete/:id', (req, res) => {
	let updateId = req.params.id;
	// Select * from videos where videos.id=videoID and videos.userId=userID
	Update.findOne({
		where: {
			id: updateId,
		},
		attributes: ['id', 'patientID']
	}).then((update) => {
		// if record is found, user is owner of video
		if (update != null) {
			Update.destroy({
				where: {
					id: updateId
				}
			}).then(() => {
				alertMessage(res, 'info', 'Update deleted', 'far fa-trash-alt', true);
				res.redirect('/update/showupdateFeed'); // To retrieve all videos again
			}).catch(err => console.log(err));
		} else {
			alertMessage(res, 'danger', 'No such update', 'fas fa-exclamation-circle', true);
		}
	});
});

module.exports = router;