const express = require('express');
const router = express.Router();
const User = require('../models/User');

//Display Login Page
// router.get('/login', (req, res) => {
//     res.render('user/login');
// });

//Display Register Page
// router.get('/register', (req, res) => {
//     res.render('user/register');
// });

module.exports = router;