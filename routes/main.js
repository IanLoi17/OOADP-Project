const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');

// Home page
router.get('/', (req, res) => {
    const title = 'Welcome to Selfcare';
    res.render('index', {title: title});
});

// Logout user
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Login page
router.get('/displaylogin', (req, res) => {
    res.render('user/login');
});

// Register page
router.get('/displayregister', (req, res) => {
    res.render('user/register');
});

// Display medical records for the current patient
router.get('/showMedicalRecords', (req, res) => {
    let name = 'John Tan';
    let age = 19;
    let height = '1.72 m';
    let weight = '58.7 kg';
    let gender = 'M';
    let bloodtype = 'O';
    let dateofbirth = '12/06/2000';
    let drugallergy = 'Sofidroux antibiotic';
    let majorillness = 'None';
    
    res.render('medicalrecords/displayRecords', {
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


module.exports = router;