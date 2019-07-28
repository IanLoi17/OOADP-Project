const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = [];

    // Retrieves fields from register page
    let {name, occupation, mobileNo, housephoneNo, nric, gender, email, age, bloodtype, weight, height, password, password2, drugallergy, majorillness} = req.body;
    let dateofbirth = moment(req.body.dateofbirth, 'DD/MM/YYYY');
    let patientID = req.body.nric;

    if (req.body.password !== req.body.password2) {
        errors.push({ text: 'Passwords do not match!' });
    }

    if (req.body.password.length < 8) {
        errors.push({ text: 'Password must be at least 8 characters!' });
    }

    if (req.body.nric.length < 9) {
        errors.push({ text: 'NRIC must contain 9 characters!'})
    }

    if (mobileNo.length < 8 || housephoneNo.length < 8) {
        errors.push({text: 'Singapore phone numbers must contain only 8 characters'})
    }

    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            occupation,
            nric,
            gender,
            mobileNo,
            housephoneNo,
            dateofbirth,
            email,
            age,
            bloodtype,
            weight,
            height,
            drugallergy,
            majorillness,
            password,
            password2
        });
    }

    else {
        // Check if user has already registered
        User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
                // If user is found, that means email has been registered
                res.render('user/register', {
                    name,
                    occupation,
                    nric,
                    gender,
                    mobileNo,
                    housephoneNo,
                    dateofbirth,
                    email,
                    age,
                    bloodtype,
                    weight,
                    height,
                    drugallergy,
                    majorillness,
                    password,
                    password2
                })
                alertMessage(res, 'danger', user.email + ' already registered! Use another email!', 'fa fa-warning', true);
            }

            else {
                // Create a new user record
                password = req.body.password;
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash("B4c0/\/", salt, function(err, hash) {
                        // Store hash in your password DB
                        password = bcrypt.hashSync(password, salt);
                        
                        if (occupation == 'Patient') {
                            if (drugallergy == '' && majorillness == '') {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="P",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy: drugallergy='None',
                                    majorillness: majorillness='None',
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }
                            
                            else if (drugallergy != '' && majorillness == '') {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="P",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy,
                                    majorillness: majorillness='None',
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }

                            else if (drugallergy == '' && majorillness != '') {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="P",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy: drugallergy='None',
                                    majorillness,
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }

                            else {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="P",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy,
                                    majorillness,
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }
                        }

                        else {
                            if (drugallergy == '' && majorillness == '') {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="D",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy: drugallergy='None',
                                    majorillness: majorillness='None',
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }
                            
                            else if (drugallergy != '' && majorillness == '') {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="D",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy,
                                    majorillness: majorillness='None',
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }

                            else if (drugallergy == '' && majorillness != '') {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="D",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy: drugallergy='None',
                                    majorillness,
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }

                            else {
                                User.create({
                                    name,
                                    occupation,
                                    patientID: patientID,
                                    nric,
                                    gender,
                                    salutation: salutation="D",
                                    mobileNo,
                                    housephoneNo,
                                    dateofbirth,
                                    email,
                                    age,
                                    bloodtype,
                                    weight,
                                    height,
                                    drugallergy,
                                    majorillness,
                                    password
                                }).then(user => {
                                    alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                    res.redirect('/displaylogin');
                                })
                                .catch(err => console.log(err));
                            }
                        }
                    })
                })
            }
        });
    }
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/records/consultationDetail',     // Route to /records/consultationDetail URL
        failureRedirect: '/displaylogin',                   // Route to /login URL
        failureFlash: true

        /* Setting the failureFlash option to true instructs Passport to flash an error
        sage using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error 
        */
    })(req, res, next);
});

module.exports = router;