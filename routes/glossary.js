const express = require('express');
const router = express.Router();
const Glossary = require('../models/Glossary.js');
const mySQLDB = require('../config/DBConfig');


// Flash Messegner
const alertMessage = require('../helpers/messenger');

//Show edit glossary page
router.get('/glossEdit/:id', (req, res) => {
    Glossary.findOne({
        where: {
            id: req.params.id
            //term: req.params.term
        }
    }).then(glossary => {
        if(glossary) {
            res.render('glossary/editGlossary', { // call views/glossary/editGlossary.handlebar to render the edit glossary page
                glossary
            });
        }
    }).catch(err => console.log(err)); // To catch no glossary term
})

//save edited video
router.put('/saveEditedGlossary/:id', (req, res) => {
    let term = req.body.term;
    let definition = req.body.definition;

    Glossary.update({
        term,
        definition
    }, {
        where: {
            id: req.params.id
            //term: req.params.term
        }
    }).then(() => {
        res.redirect('/glossary/glossary') // redirect to call router.get(/glossary...) to retrieve all updated glossary
    }).catch(err => console.log(err));
});

// Shows add glossary page
router.get('/showAddGlossary', (req, res) => {
	res.render('glossary/addGlossary');
});

//Adds new glossary jot
router.post('/addGlossary', (req, res) => {
    let term = req.body.term;
    let definition = req.body.definition;

    // Multi-value components return array of strings or undefined
    Glossary.create({
        term,
        definition
    }).then((glossary) => {
        res.redirect('/glossary/glossary'); // redirect to call router.get(/glossary...) to retrieve all updated glossary
    }).catch(err => console.log(err))

});

//List glossary belonging to current logged in user
router.get('/glossary', (req, res) => {
    Glossary.findAll({
        order: [
            ['term', 'ASC']
        ],
        raw: true
    }).then((glossaries) => {
        res.render('glossary/glossary', { // pass object to glossary.handlebar
            glossaries
        });
    }).catch(err => console.log(err));
});

router.get('/delete/:id', (req, res) => {
    let glossaryId = req.params.id;
    // Select * from videos where glossary.id=glossaryID and glossary.userId=userID
    Glossary.findOne({
        where: {
            id: glossaryId
        },
        attributes: ['id']
    }).then((glossary) => {
        // if record is found, user is owner of glossary
        if (glossary != null) {
            Glossary.destroy({
                where: {
                    id: glossaryId
                }
            }).then(() => {
                alertMessage(res, 'info', 'One term deleted', 'far fa-trash-alt', true);
                res.redirect('/glossary/glossary'); // To retrieve all glossaries again
            }).catch(err => console.log(err));
        }else {
            alertMessage(res, 'danger', 'No such term', 'fas fa-exclamation-circle', true);
        }

    });
});





module.exports = router;




