const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    const title = 'Welcome to Selfcare';
    res.render('index', {title: title});
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
    
    res.render('medicalrecords/displayMedicRecords', {
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

// Enter medical records for the current patient
router.get('/enterMedicalRecords', (req, res) => {
    res.render('medicalrecords/enterRecords');
});

module.exports = router;