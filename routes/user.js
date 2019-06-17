const express = require('express');
const router = express.Router();
const User = require('../models/User');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const alertMessage = require('../helpers/messenger');

// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = [];

    // Retrieves fields from register page
    let {name, occupation, nric, gender, email, age, bloodtype, weight, height, password, password2, drugallergy, majorillness} = req.body;
    let dateofbirth = moment(req.body.dateofbirth, 'DD/MM/YYYY');

    if (req.body.password !== req.body.password2) {
        errors.push({ text: 'Passwords do not match!' });
    }

    if (req.body.password.length < 8) {
        errors.push({ text: 'Password must be at least 8 characters!' });
    }

    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            occupation: occupation,
            nric,
            gender,
            dateofbirth,
            email,
            age,
            bloodtype,
            weight,
            height,
            drugallergy,
            majorillness
        })
    }

    else {
        // Check if user has already registered
        User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
                // If user is found, that means email has been registered
                res.render('user/register', {
                    name,
                    occupation: occupation,
                    nric,
                    gender,
                    dateofbirth,
                    email,
                    age,
                    bloodtype,
                    weight,
                    height,
                    drugallergy,
                    majorillness
                })
                alertMessage(res, 'danger', user.email + ' already registered! Use another email!', 'fa fa-warning', true);
            }

            else {
                password = req.body.password;
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash("B4c0/\/", salt, function (err, hash) {
                        password = bcrypt.hashSync(password, salt)

                        User.create({
                            name,
                            occupation: occupation,
                            nric,
                            gender,
                            dateofbirth,
                            email,
                            age,
                            bloodtype,
                            weight,
                            height,
                            password,
                            drugallergy,
                            majorillness
                        }).then(user => {
                            alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/displaylogin')
                        })
                    })
                })
            }
        })
    }
});

// Login form POST => /user/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',                   // Route to the home page URL
        failureRedirect: '/displaylogin',       // Route to /login page URL
        failureFlash: true
        /*  Setting the failureFlash option to true instructs Passport to flash an error
            message using the message given by the strategy's verify callback, if any.
            When a failure occur passport passes the message object as error 
        */

    })(req, res, next);
});

module.exports = router;