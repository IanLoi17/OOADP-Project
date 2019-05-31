const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const title = 'Selfcare';
    res.render('index', {title: title});
});

router.get('/showMedicalRecords', (req, res) => {
    res.render('medicalrecords/displayMedicRecords');
});

module.exports = router;