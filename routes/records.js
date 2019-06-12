const express = require('express');
const router = express.Router();
const Records = require('../models/Records');

router.get('/enterMedicalRecords', (req, res) => {
    res.render('records/enterRecords');
});

router.post('/records/enterMedicalRecords', (req, res) => {
    let medicalrecords = req.body.medicalrecords;
    let information = req.body.information;

    Records.create({
        medicalrecords,
        information
    }) .then((records) => {
        res.redirect('/medicalrecords/displayRecords');
    })
    .catch(err => console.log(err))
});

module.exports = router;