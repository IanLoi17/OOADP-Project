const express = require('express');
const router = express.Router();
const Records = require('../models/Records');


router.get('/listRecords', (req, res) => {
    res.render('medicalrecords/listRecords');
    // Records.findAll({
    //     where: {
    //         userId: req.user.id
    //     },

    //     order: [
    //         ['title', 'ASC']
    //     ],

    //     raw: true
    // })
    // .then((records) => {
    //     res.render('medicalrecords/listRecords', {
    //         records: records
    //     });
    // })
    // .catch(err => console.log(err));
});

router.get('/addRecords', (req, res)=>{
    res.render('./medicalrecords/enterRecords');
});

router.post('/addRecords', (req, res) => {
    let medicalrecords = req.body.medicalrecords;
    let information = req.body.information;

    Records.create({
        records: medicalrecords,
        information
    }) .then((record) => {
        res.redirect('/records/listRecords')
    })
    .catch(err => console.log(err));
});


module.exports = router;